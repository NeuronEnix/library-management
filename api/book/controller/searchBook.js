const BookModel = require( "../model" );
const { resOk, resRender } = require( "../../../handler").resHandler;

const { noOfBookListPerPage } = require( "../../../config").book;

module.exports = async ( req, res, next ) => {
    const pg = req.query.pg; // pg => pageNo
    const title = req.query.title.split("").join(".*");
    const noOfDocToBeSkipped = pg * noOfBookListPerPage;
    const bookDocList = await BookModel
                            .find( { title: new RegExp( title ) }, { title:1, author:1, edition:1, qty:1 } )
                            .skip( noOfDocToBeSkipped || 0 )
                            .limit( noOfBookListPerPage || 10 );

    if( req.query.redirectURL )
        return resRender( res, redirectURL, { bookMiniCardData: bookDocList } );
    return resOk( res, bookDocList );
}