const BookModel = require( "../model" );

const { resOk, resRender } = require( "../../../handler").resHandler;

module.exports = async( req, res, next) => {
    req.query.pg = req.query.pg ? parseInt( req.query.pg ) : 0;
    const { pg, title, author, edition, redirectURL } = req.query;
    

    return resRender( res, "book/bookPage", {
        navBar: { active: "Book" },
        bookMiniCardData: await BookModel.searchBook( pg, title, author, edition ),
        eleKeyValPair: req.query,
        pg: req.query.pg
    });

}