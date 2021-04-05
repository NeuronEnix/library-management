const PurchaseModel = require( "../model" );
const { BookModel } = require( "../../book");
const { resOk, resErr, resErrType, resRender } = require( "../../../handler").resHandler;

module.exports = async ( req, res, next ) => {
    try {
        const { book_id } = req.body;
        const bookDoc = await BookModel.findById( book_id,  { qty:1 } );
        
        // If book not found
        if ( !bookDoc ) return resErr( res, resErrType.resNotFound, { infoToClient: "Invalid Book" } );
        
        bookDoc.qty += parseInt( req.body.qty );
        bookDoc.save();
        const purchaseDoc = new PurchaseModel();
        Object.assign( purchaseDoc, req.body );
        purchaseDoc.user_id = req.session.uid;
        await purchaseDoc.save()

        const popup = { typ: "success", msg: "Book Purchased!" };
        const { seller, qty } = req.body;

        return resRender( res, "book/purchaseBookPage", { ...req.body, popup, disableInput: true });

    } catch ( err ) {
        resErr( res, resErrType.unknownErr, { infoToServer: err } );
    }


}