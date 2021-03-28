const BookModel = require( "../model" );
const { resOk, resRender } = require( "../../../handler").resHandler;

const { noOfBookListPerPage } = require( "../../../config").book;

module.exports = async ( req, res, next ) => {
    const { pg, title, author, edition, redirectURL } = req.query;
    // const pg = req.query.pg; // pg => pageNo
    // const title = req.query.title.split("").join(".*");
    // const noOfDocToBeSkipped = pg * noOfBookListPerPage;
    // const bookDocList = await BookModel
    //                         .find( { title: new RegExp( title ) }, { title:1, author:1, edition:1, qty:1 } )
    //                         .skip( noOfDocToBeSkipped || 0 )
    //                         .limit( noOfBookListPerPage || 10 );
    const bookDocList = await BookModel.searchBook(
        pg, title, author, edition,
    );

    if( req.query.redirectURL )
        return resRender( res, req.query.redirectURL, { bookMiniCardData: bookDocList } );
    else
        return resOk( res, bookDocList );
}