const BookModel = require( "../model" );
const { resOk, } = require( "../../../handler").resHandler;

const { noOfBookListPerPage } = require( "../../../config").book;

module.exports = async ( req, res, next ) => {
    const { pg } = req.query; // pg => pageNo
    const noOfDocToBeSkipped = pg * noOfBookListPerPage;
    console.log( noOfDocToBeSkipped )
    const bookDocList = await BookModel
                            .find( {}, { __v:0, user_id:0} )
                            .skip( noOfDocToBeSkipped || 0 )
                            .limit( noOfBookListPerPage || 10 );
    return resOk( res, bookDocList );
}