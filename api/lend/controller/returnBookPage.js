const LendModel = require( "../model" );

const { UserModel }=require( "../../user" );
const { resOk, resRender } = require( "../../../handler").resHandler;

module.exports = async( req, res, next) => {
    req.query.pg = req.query.pg ? parseInt( req.query.pg ) : 0;
    const { pg, title, author, edition, redirectURL, email } = req.query;
    return resRender( res, "borrower/returnBookPage", {
        navBar: { active: "Return Book" },
        bookMiniCardData: await LendModel.getLentBookList( email ),
        bookMiniCardButtons: [
            { method: "post", action: "/book/return", label: "Return" },
        ],
        eleKeyValPair: req.query,
        pg: req.query.pg
    });

}