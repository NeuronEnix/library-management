const BookModel = require( "../model" );

const { resOk, resRender } = require( "../../../handler").resHandler;

module.exports = async( req, res, next) => {
    req.query.pg = req.query.pg ? parseInt( req.query.pg ) : 0;
    const { pg, title, author, edition, redirectURL } = req.query;
    

    return resRender( res, "book/bookPage", {
        navBar: { active: "Book" },
        bookMiniCardData: await BookModel.searchBook( pg, title, author, edition ),
        bookMiniCardButtons: [
            { method: "get", action: "/book/lend", label: "Lend" },
            { method: "get", action: "/book/return", label: "Return" },
            { method: "get", action: "/book/view", label: "View" },
            { method: "get", action: "/book/purchase", label: "Purchase" },
        ],
        eleKeyValPair: req.query,
        pg: req.query.pg
    });

}