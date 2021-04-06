const Joi = require("joi");
const { resRender, resErrType } = require( "../../handler" ).resHandler;
const { bookSchema } = require( "../book/validation" );

const purchaseSchema = {

    seller: Joi.string().min(1).max(20),
    qty: Joi.number().min(1).max(1000000),

}

module.exports.postPurchase = ( req, res, next ) => {
    Joi.object({

        book_id: bookSchema.book_id.required(),
        title: bookSchema.title.required(),
        author: bookSchema.author.required(),
        edition: bookSchema.edition.required(),

        seller: purchaseSchema.seller.required(),
        qty: purchaseSchema.qty.required(),

    }).validateAsync( req.body )
        .then( _ => next() )
        .catch( err => resRender( res, "book/purchaseBookPage", {
            ...req.body,
            popup: { typ:"warning", msg: err.details[0].message }
            }, resErrType.validationErr,
        ));
}
