const mongoose = require( 'mongoose' ) ;

const { ObjectId } = mongoose.Schema.Types;

let bookSchema = new mongoose.Schema ({
    title: { type: String, required: true },
    author: { type: String, required: true },
    edition: { type: Number, required:true },
    qty: { type: Number, default:0 },
    lend_price: { type: Number, required: true },
    user_id: { type: ObjectId, ref: "users", required: true }, // user who adds the book
});

bookSchema.index( { title:1, author:1, edition: 1 }, { unique: true } );

const BookModel = mongoose.model( 'books', bookSchema ) ;
module.exports = BookModel;


