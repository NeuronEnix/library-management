const BookModel = require( "../model" );

const { resRender } = require( "../../../handler").resHandler;

module.exports = async( req, res, next) => {

    return resRender( res, "book/bookViewPage", {
        eleKeyValPair: req.query,
    } );

}