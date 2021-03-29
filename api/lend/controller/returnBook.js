const LendModel = require( "../model" );
const { BookModel } = require( "../../book");
const { UserModel } = require( "../../user");
const { resOk, resErr, resErrType, resRender } = require( "../../../handler").resHandler;

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
        
        const userDoc = await UserModel.findById( req.body.borrower_id, "-_id email" );

        return resRender( res, "borrower/returnBookPage", {
            navBar: { active: "Return Book" },
            bookMiniCardData: await LendModel.getLentBookList( userDoc.email ),
            bookMiniCardButtons: [
                { method: "post", action: "/book/return", label: "Return" },
            ],
            popup: { typ: "success", msg: `${req.body.title} - Returned!`},
            eleKeyValPair: { email: userDoc.email },
            pg: 0
        });
        // return resOk( res, lendDoc );
        
    } catch ( err ) {
        
        return resErr( res, resErrType.unknownErr, { infoToServer:err } );
    }
}