const BookModel = require( "../model" );

const { resOk, resErr, resErrType, resRender } = require( "../../../handler").resHandler;
module.exports = async ( req, res, next ) => {
    
    try {

        const bookDoc = new BookModel();
        Object.assign( bookDoc, req.body );
        bookDoc.user_id = req.session.uid;
        await bookDoc.save();
        return resOk( res, bookDoc );
        
    } catch ( err ) {
        
        // Duplicate Error
        const book = req.body;
        
        if( err.code === 11000 ) {
            const { title, edition, author } = req.body;
            const popup = {
                typ: "warning",
                msg: `"${title}" - By: ${ author } - Edition: ${edition} - Already Exist!` 
            }
            
            return resRender( res, "book/addBook", { popup, fieldData: req.body }, resErrType.duplicateErr );
            // return resErr( res, resErrType.duplicateErr,{
            //     infoToClient: 
            // });
        }

        return resErr( res, resErrType.unknownErr, { infoToServer:err } );
    }
}