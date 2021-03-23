const BookModel = require( "../model" );
const { resOk, } = require( "../../../handler").resHandler;

const { noOfBookListPerPage } = require( "../../../config").book;

module.exports = async ( req, res, next ) => {
    const { pageNo } = req.query;
    const noOfDocToBeSkipped = pageNo * noOfBookListPerPage;
    const bookDocList = await BookModel
                            .find( {}, { __v:0, user_id:0} )
                            .skip( noOfDocToBeSkipped )
                            .limit( noOfBookListPerPage );
    return resOk( res, bookDocList );
}