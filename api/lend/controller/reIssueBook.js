const LendModel = require( "../model" );
const { ObjectId } = require( "mongoose" ).Types;
const moment = require( "moment" );
const { resErr, resErrType, } = require( "../../../handler").resHandler;

module.exports = async ( req, res, next ) => {
    const { lend_id } = req.body;
    try {
       console.log(await LendModel.updateOne(
            { _id:lend_id, sts: { $eq: "l" } },
            { 
                $push: { re_iss: moment() },
                $set: { due_at: moment().add( 7, "days" ) },
            },
        ));
        const reIssuedData = await LendModel.aggregate([
            { $match: { _id: ObjectId( lend_id ) } },
            { $project: { borrower_id:1, book_id:1 } },
            { $lookup: {
                from: "books",
                foreignField: "_id",
                localField: "book_id",
                as: "bookDoc"
            } },
            { $unwind: "$bookDoc" },
            { $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "borrower_id",
                as: "userDoc"
            } },
            { $unwind: "$userDoc" },
            { $project: { bookTitle: "$bookDoc.title", userEmail: "$userDoc.email", _id:0 } },
        ])
        return res.redirect( "/book/user-book" + `?email=${reIssuedData[0].userEmail}&popTyp=warning&popMsg=Book Re-Issued - ${reIssuedData[0].bookTitle}` );
        
    } catch ( err ) {
        return resErr( res, resErrType.unknownErr, { infoToServer:err } );
    }
}