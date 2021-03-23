const LendModel = require( "../model" );
const { BookModel } = require( "../../book");
const { resOk, resErr, resErrType } = require( "../../../handler").resHandler;

const { maxBookLendPerUser } = require( "../../../config").lend

module.exports = async ( req, res, next ) => {
    
    try {
        
        const bookDoc = await BookModel.findById( req.body.book_id, "qty" );
        
        // If Enough Quantity is not available
        if ( bookDoc.qty <= 0 ) return resErr( res, resErrType.outOfStock, { infoToClient: "Out Of Stock" } ); 
        
        bookDoc.qty -= 1;
        bookDoc.save(); // Deduct and save and then lend the book

        const lendDoc = await LendModel();

        Object.assign( lendDoc, req.body );
        lendDoc.user_id = req.user.uid;
        
        await lendDoc.save();

        return resOk( res, lendDoc );

        
        
    } catch ( err ) {
        
        return resErr( res, resErrType.unknownErr, { infoToServer:err } );
    }
}