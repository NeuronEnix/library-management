const mongoose = require( 'mongoose' ) ;

const { ObjectId } = mongoose.Schema.Types;

var bookSchema = new mongoose.Schema ({
    title: { type: String, index: { unique: true }, required: true },
    author: { type: String, required: true },
    copies: { type: Number, required: true, default:0 },
    user_id: { type: ObjectId, required: true }, // user who adds the book
});

const BookModel = mongoose.model( 'books', bookSchema ) ;
module.exports = BookModel;
