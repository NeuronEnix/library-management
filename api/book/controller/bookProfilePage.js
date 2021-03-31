const BookModel = require( "../model" );

const { resRender } = require( "../../../handler").resHandler;

module.exports = async( req, res, next) => {

    // BookModel.aggregate( )
    return resRender( res, "book/bookProfilePage", {
        eleKeyValPair: req.query,
    } );

}