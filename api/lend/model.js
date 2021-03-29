const mongoose = require( 'mongoose' ) ;
const moment = require( "moment" );
const util = require("util");

const { UserModel } = require( '../user' );
const { BookModel } = require( '../book' );

const { ObjectId } = mongoose.Schema.Types;
const lendSchema = new mongoose.Schema ({
    lender_id: { type: ObjectId, index: true },
    borrower_id: { type: ObjectId, index: true },
    book_id: { type: ObjectId, index: true },
    lent_at: { type: Date, default: moment() },
    due_at: { type: Date, default: moment().add( 7, "days" ) },
    ret_at: { type: Date },
    sts: { type: String, default:'l' },     // 'l' -> lent ; 'r' -> returned
});


lendSchema.statics.getLentBookList = async ( email ) => {
   const userDoc = await UserModel.findOne( { email }, { email:1 } );
   
   if ( !userDoc ) return [];

   return await LendModel.aggregate([
        { $match: { borrower_id: userDoc._id, sts: "l" } },
        { $lookup:
            {
                from: "books",
                let: { book_id: "$book_id" },
                pipeline: [
                    { $match: { $expr: { $eq: [ "$_id", "$$book_id"] } } },
                    { $project: { _id:0, title:1, author:1, edition:1 } },
                ],
                as: "bookDoc"
            }
        },
        { $unwind: "$bookDoc"},
        { $addFields:
            { 
                lend_id: "$_id", 
                title: "$bookDoc.title",
                author: "$bookDoc.author",
                edition: "$bookDoc.edition",
            } 
        },
        { $project: { _id:0, bookDoc:0, __v:0 } }
        ]
    )
    
}

const LendModel = mongoose.model( 'issue', lendSchema ) ;
module.exports = LendModel;
