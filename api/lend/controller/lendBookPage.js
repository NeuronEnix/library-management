const { BookModel } = require( '../../book' );
const { resRender } = require( "../../../handler").resHandler;


module.exports = async ( req, res, next ) => {
    const data = await BookModel.findById( req.query.book_id, { title:1, author:1, edition:1 } );
    return resRender( res, "borrower/lendBookPage", data );
}