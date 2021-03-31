const BookModel = require( "../model" );

const { resRender } = require( "../../../handler").resHandler;

module.exports = async( req, res, next) => {
console.log( req.query )
    return resRender( res, "user/userProfilePage", {
        eleKeyValPair: req.query,
    } );

}