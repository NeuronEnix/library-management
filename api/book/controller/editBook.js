const BookModel = require( "../model" );

const { resOk, resErr, resErrType, resRender } = require( "../../../handler").resHandler;
module.exports = async ( req, res, next ) => {
    const { book_id, title, author, edition } = req.body;
    try {
        ;
        console.log(await BookModel.updateOne( { _id: book_id }, { $set: { title, author, edition } } ) )
        const query = `book_id=${book_id}&popTyp=success&popMsg=Book Edited`;

        res.redirect( "/book/profile?" + query );
        
        
    } catch ( err ) {
        if ( err.code === 11000 ) {
            const popTyp = "warning";
            const popMsg = `"${title}" - By: ${ author } - Edition: ${edition} - Already Exist!`;
            return res.redirect( "/book/profile" + `?book_id=${book_id}&popTyp=${popTyp}&popMsg=${popMsg}` );
        }

        return resErr( res, resErrType.unknownErr, { infoToServer:err } );
        
    }
}