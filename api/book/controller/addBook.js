const BookModel = require( "../model" );

const { resOk, resErr, resErrType } = require( "../../../handler").resHandler;
module.exports = async ( req, res, next ) => {
    try {
        const bookDoc = new BookModel();
        Object.assign( bookDoc, req.body );
        bookDoc.user_id = req.user.uid;
        await bookDoc.save();
        return resOk( res, bookDoc );
    } catch ( err ) {
        if( err.code === 11000 ) return resErr( res, resErrType.duplicateErr, { infoToClient: "Book Title already exist" } );
        return resErr( res, resErrType.unknownErr, { infoToServer:err } );
    }
}