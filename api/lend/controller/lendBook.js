const LendModel = require( "../model" );
const { BookModel } = require( "../../book");
const { UserModel } = require( "../../user" );
const { resOk, resErr, resErrType, resRender } = require( "../../../handler").resHandler;

const { maxBookLendPerUser } = require( "../../../config").lend

module.exports = async ( req, res, next ) => {
    
    try {
        
        const borrowerDoc = await UserModel.findOne( {email:req.body.email}, {_id:1} )
        if ( !borrowerDoc ) {
            const popup = { typ: "warning", msg: "Borrower's Email is not Registered!" };
            return resRender( res, "borrower/lendBookPage", { popup, ...req.body }, resErrType.unAuthorized );
            // return resErr( res, resErrType.resNotFound, { infoToClient: "Email Not Registered" } );
        }

        const bookDoc = await BookModel.findById( req.body.book_id, "qty" );
        
        if ( !bookDoc ){
            const popup = { typ: "danger", msg: "Book Not Found!" };
            return resRender( res, "borrower/lendBookPage", { popup, ...req.body }, resErrType.resNotFound );
            // return resErr( res, resErrType.resNotFound, { infoToClient: "Book Not Found" } );
        }
        // If Enough Quantity is not available
        if ( bookDoc.qty <= 0 ){

            const popup = { typ: "warning", msg: "Book Out of Stock" };
            return resRender( res, "borrower/lendBookPage", { popup, ...req.body }, resErrType.outOfStock );
            // return resErr( res, resErrType.outOfStock, { infoToClient: "Out Of Stock" } );   
        } 
        
        bookDoc.qty -= 1;
        bookDoc.save(); // Deduct and save and then lend the book

        const lendDoc = await LendModel();

        Object.assign( lendDoc, req.body );
        lendDoc.lender_id = req.session.uid;
        lendDoc.borrower_id = borrowerDoc._id;
        
        await lendDoc.save();
        
        const popup = { typ: "success", msg: "Book Lent!" };
        return resRender( res, "borrower/lendBookPage", {
            popup, ...req.body, disableEmail: true, eleKeyValPair: { email: req.body.email } 
        });
        
        // return resOk( res, lendDoc );

        
        
    } catch ( err ) {
        
        return resErr( res, resErrType.unknownErr, { infoToServer:err } );
    }
}