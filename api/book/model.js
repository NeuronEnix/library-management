const mongoose = require( 'mongoose' ) ;

const { noOfBookListPerPage } = require( "../../config").book;

const { ObjectId } = mongoose.Schema.Types;

let bookSchema = new mongoose.Schema ({
    title: { type: String, required: true },
    author: { type: String, required: true },
    edition: { type: Number, required:true },
    pub: { type: String, required: true },
    qty: { type: Number, default:0 },
    lend_price: { type: Number, required: true },
    user_id: { type: ObjectId, ref: "users", required: true }, // user who adds the book
});

bookSchema.index( { title:1, author:1, edition: 1 }, { unique: true } );

bookSchema.statics.searchBook = async ( pg, title, author = "", edition = undefined ) => {
    pg = typeof pg == 'undefined' ? 0 : parseInt( pg );
    title = typeof title != 'string' ? "" : title;
    
    const noOfDocToBeSkipped = pg * noOfBookListPerPage;
    
    title = title.split("").join(".*");
    author = author.split("").join(".*");

    const filter = {
        title: new RegExp( title, "i" ),
        author: new RegExp( author, "i" ),
    };
    if ( edition ) { filter.edition = edition; }

    const project = {
        title:1, author:1, edition:1, qty:1
    }
    return await BookModel.aggregate([
        { $match: filter },
        { $skip: noOfDocToBeSkipped || 0 },
        { $limit: noOfBookListPerPage || 10 },
        { $addFields: { book_id: "$_id" } },
        { $project: { _id:0, author:1, title:1, edition:1, book_id:1, qty:1 } }
    ]);

}


const BookModel = mongoose.model( 'books', bookSchema ) ;
module.exports = BookModel;


