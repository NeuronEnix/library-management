const BookModel = require( "../model" );

const { resOk, resRender } = require( "../../../handler").resHandler;

module.exports = async( req, res, next) => {
    const { pg, title, author, edition, redirectURL } = req.query;
    return resRender( res, "book/book", {
        navBar: { active: "Book" },
        bookMiniCardData: await BookModel.searchBook(pg, title, author, edition)
    });

}