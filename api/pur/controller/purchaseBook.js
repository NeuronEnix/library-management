const PurchaseModel = require( "../model" );
const { BookModel } = require( "../../book");
const { resOk, resErr, resErrType, resRender } = require( "../../../handler").resHandler;

module.exports = async ( req, res, next ) => {
    try {
        const { book_id } = req.body;
        const bookDoc = await BookModel.findById( book_id, "qty" );
        
        // If book not found
        if ( !bookDoc ) {
            const popup = { typ: "warning", msg: "Invalid Book" };
            return resRender( res, "book/purchaseBookPage", { popup, eleKeyValPair: req.body }, resErrType.resNotFound );
                // return resErr( res, resErrType.resNotFound,{
                //     infoToClient: "Invalid Book",
                //     infoToServer: `Invalid book_id: ${book_id}`
                // })

        }
        
        bookDoc.qty += parseInt( req.body.qty );
        bookDoc.save();
        const purchaseDoc = new PurchaseModel();
        Object.assign( purchaseDoc, req.body );
        purchaseDoc.user_id = req.session.uid;
        await purchaseDoc.save()

        const popup = { typ: "success", msg: "Book Purchased!" };
        const { seller, qty } = req.body;

        delete req.body.seller;
        delete req.body.qty;
        return resRender( res, "book/purchaseBookPage", { ...req.body,
            popup, eleKeyValPair: { seller, qty }, disableInput: true
        });

        // resOk( res, purchaseDoc );
    } catch ( err ) {
        resErr( res, resErrType.unknownErr, { infoToServer: err } );
    }


}