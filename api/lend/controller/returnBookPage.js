const LendModel = require( "../model" );1

const { UserModel }=require( "../../user" );
const { resOk, resRender } = require( "../../../handler").resHandler;

module.exports = async( req, res, next) => {
    req.query.pg = req.query.pg ? parseInt( req.query.pg ) : 0;
    const { pg, title, author, edition, redirectURL, email } = req.query;

    const pageData = {
        navBar: { active: "Return Book" },
        bookMiniCardData: await LendModel.getLentBookList( email ),
        bookMiniCardButtons: [
            { method: "post", action: "/book/return", label: "Return" },
        ],
        eleKeyValPair: req.query,
        pg: req.query.pg
    };
    if ( email && await UserModel.exists( { email } ) == false )
        pageData.popup = { typ: "warning", msg: "Email Not Registered!" };
        
    return resRender( res, "borrower/returnBookPage", pageData );

}