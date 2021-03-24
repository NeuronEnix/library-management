const LendModel = require( "../model" );
const { BookModel } = require( "../../book");
const { resOk, resErr, resErrType } = require( "../../../handler").resHandler;

module.exports = async ( req, res, next ) => {
    
    try {

        const lendDoc = await LendModel.findById( req.body.lend_id, {sts:1, book_id:1} );

        if ( !lendDoc ) return resErr( res, resErrType.resNotFound, { infoToClient: "Couldn't Return: user_id or lend_id incorrect"} );
        if ( lendDoc.sts === "r" ) return resOk( res, "Book was already returned" );

        Object.assign( lendDoc, { sts:"r", ret_at: new Date() } );
        await lendDoc.save();

        const bookDoc = await BookModel.findById( lendDoc.book_id, "qty" );
                
        bookDoc.qty += 1;
        bookDoc.save(); // Deduct and save and then lend the book

        return resOk( res, lendDoc );
        
    } catch ( err ) {
        
        return resErr( res, resErrType.unknownErr, { infoToServer:err } );
    }
}