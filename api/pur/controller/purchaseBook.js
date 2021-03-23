const PurchaseModel = require( "../model" );
const { BookModel } = require( "../../book");
const { resOk, resErr, resErrType } = require( "../../../handler").resHandler;

module.exports = async ( req, res, next ) => {
    try {
        const { book_id } = req.body;
        const bookDoc = await BookModel.findById( book_id, "qty" );
        
        // If book not found
        if ( !bookDoc ) 
            return resErr( res, resErrType.resNotFound,{
                infoToClient: "Invalid Book",
                infoToServer: `Invalid book_id: ${book_id}`
            })
        
        bookDoc.qty += parseInt( req.body.qty );
        bookDoc.save();
        const purchaseDoc = new PurchaseModel();
        Object.assign( purchaseDoc, req.body );
        purchaseDoc.user_id = req.user.uid;
        await purchaseDoc.save()

        resOk( res, purchaseDoc );
    } catch ( err ) {
        resErr( res, resErrType.unknownErr, { infoToServer: err } );
    }


}