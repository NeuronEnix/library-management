const mongoose = require( 'mongoose' ) ;

const { ObjectId } = mongoose.Schema.Types;

let purchaseSchema = new mongoose.Schema ({
    seller: { type: String, required: true },
    qty: { type: Number, required: true },
    pur_at: { type: Date, default: Date.now },
    user_id: { type: ObjectId, ref: "users", required: true }, // user who adds the book
    book_id: { type: ObjectId, ref: "books", required: true }, // user who adds the book
});

const PurchaseModel = mongoose.model( 'purchases', purchaseSchema ) ;
module.exports = PurchaseModel;


