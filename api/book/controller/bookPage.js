const BookModel = require( "../model" );

const { resRender } = require( "../../../handler").resHandler;
const { noOfBookListPerPage } = require( "../../../config").book;

module.exports = async( req, res, next) => {
    let { pg, pgAction, title, author, edition, } = req.query;
    
    pg = pg ? parseInt( pg ) : 0;
    if ( pgAction === "next" ) ++pg;
    else if ( pgAction === "prev" && pg > 0 ) --pg;
    
    const noOfDocToBeSkipped = pg * noOfBookListPerPage;

    const filter = {};
    if ( title ) filter.title = new RegExp( title.split("").join(".*"), "i" );
    if ( author ) filter.author = new RegExp( author.split("").join(".*"), "i" );
    if ( edition ) filter.edition = parseInt( edition );

    const searchData = await BookModel.aggregate([
        { $match: filter },
        { $sort: { title:1 } },
        { $skip: noOfDocToBeSkipped || 0 },
        { $limit: noOfBookListPerPage || 10 },
        { $addFields: { book_id: "$_id" } },
        { $project: { _id:0, author:1, title:1, edition:1, book_id:1, qty:1 } }
    ]);

    return resRender( res, "book/bookPage", {
        pg, title, author, edition,
        miniCardDataList: searchData,
    });

}