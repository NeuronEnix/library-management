const BookModel = require( "../model" );
const { resOk, } = require( "../../../handler").resHandler;

const { noOfBookListPerPage } = require( "../../../config").book;

module.exports = async ( req, res, next ) => {
    const pg = req.query.pg; // pg => pageNo
    const title = req.query.title.split("").join(".*");
    const noOfDocToBeSkipped = pg * noOfBookListPerPage;
    const bookDocList = await BookModel
                            .find( { title: new RegExp( title ) }, { __v:0, user_id:0 } )
                            .skip( noOfDocToBeSkipped || 0 )
                            .limit( noOfBookListPerPage || 10 );
    return resOk( res, bookDocList );
}