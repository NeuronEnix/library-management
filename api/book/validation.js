const Joi = require("joi");
const { resRender, resErrType } = require( "../../handler" ).resHandler;

const schema = {

    book_id: Joi.string().alphanum().min(24).max(24),
    sts: Joi.string().min(1).max(1),
    
    title: Joi.string().alphanum().min(1).max(20),
    author: Joi.string().alphanum().min(1).max(20),
    edition: Joi.number().min(1).max(20),

    pub: Joi.string().alphanum().min(1).max(20),
    lend_price: Joi.number().min(10).max(1000),
    
}

module.exports.postAdd = ( req, res, next ) => {
    Joi.object({

        title: schema.title.required(),
        author: schema.author.required(),
        edition: schema.edition.required(),
        pub: schema.pub.required(),
        lend_price: schema.lend_price.required(),

    }).validateAsync( req.body )
        .then( _ => next() )
        .catch( err => resRender( res, "book/addBook", {
            ...req.body,
            popup: { typ:"warning", msg: err.details[0].message }
            }, resErrType.validationErr,
        ));
}

module.exports.postEditBook = ( req, res, next ) => {
    Joi.object({

        book_id: schema.book_id.required(),
        title: schema.title.required(),
        author: schema.author.required(),
        edition: schema.edition.required(),
        editable: Joi.string().valid( 'true', 'false' ).required(),

    }).validateAsync( req.body )
        .then( _ => next() )
        .catch( err => res.redirect( "/book/profile" + 
            `?user_id=${req.body.book_id}` +
            '&popTyp=warning' +
            `&popMsg=${err.details[0].message}`
         ));
}

module.exports.postUpdateStatus = ( req, res, next ) => {
    Joi.object({

        book_id: schema.book_id.required(),
        sts: schema.sts.required(),

    }).validateAsync( req.body )
        .then( _ => next() )
        .catch( err => res.redirect( "/book/profile" + 
            `?user_id=${req.body.book_id}` +
            '&popTyp=warning' +
            `&popMsg=${err.details[0].message}`
         ));
}
