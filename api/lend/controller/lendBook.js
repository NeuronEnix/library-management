const LendModel = require( "../model" );
const { BookModel } = require( "../../book");
const { UserModel } = require( "../../user" );
const { resOk, resErr, resErrType } = require( "../../../handler").resHandler;

const { maxBookLendPerUser } = require( "../../../config").lend

module.exports = async ( req, res, next ) => {
    
    try {
        
        const borrowerDoc = await UserModel.findOne( {email:req.body.email}, {_id:1} )
        if ( !borrowerDoc ) 
            return resErr( res, resErrType.resNotFound, { infoToClient: "Email Not Registered" } );

        const bookDoc = await BookModel.findById( req.body.book_id, "qty" );
        
        if ( !bookDoc )
            return resErr( res, resErrType.resNotFound, { infoToClient: "Book Not Found" } );
        // If Enough Quantity is not available
        if ( bookDoc.qty <= 0 ) return resErr( res, resErrType.outOfStock, { infoToClient: "Out Of Stock" } ); 
        
        bookDoc.qty -= 1;
        bookDoc.save(); // Deduct and save and then lend the book

        const lendDoc = await LendModel();

        Object.assign( lendDoc, req.body );
        lendDoc.lender_id = req.session.uid;
        lendDoc.borrower_id = borrowerDoc._id;
        
        await lendDoc.save();

        return resOk( res, lendDoc );

        
        
    } catch ( err ) {
        
        return resErr( res, resErrType.unknownErr, { infoToServer:err } );
    }
}