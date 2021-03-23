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
        
        // Duplicate Error
        const book = req.body;
        
        if( err.code === 11000 ) {
            const { title, edition, author } = req.body;
            return resErr( res, resErrType.duplicateErr,{
                infoToClient: `"${title}" - Edition: ${edition} - By: ${ author } Already Exist` 
            });
        }

        return resErr( res, resErrType.unknownErr, { infoToServer:err } );
    }
}