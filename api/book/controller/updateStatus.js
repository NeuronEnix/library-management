const BookModel = require( "../model" );

const { resOk, resErr, resErrType, resRender } = require( "../../../handler").resHandler;
module.exports = async ( req, res, next ) => {
    try {
        
        const { book_id, sts } = req.body;

        switch ( sts ) {
            case "e": popTyp = "success"; popMsg = "Book Enabled"; break;
            case "d": popTyp = "danger"; popMsg = "Book Disabled"; break;
        }

        await BookModel.updateOne( { _id: book_id }, { $set: { sts } } );

        const query = `book_id=${book_id}&popTyp=${popTyp}&popMsg=${popMsg}`;

        res.redirect( "/book/profile?" + query );
        
        
    } catch ( err ) {
        return resErr( res, resErrType.unknownErr, { infoToServer:err } );
    }
}