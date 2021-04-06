const Joi = require("joi");
const { resRender, resErrType } = require( "../../handler" ).resHandler;
const { bookSchema } = require( "../book/validation" );
const { userSchema } = require( "../user/validation" );

module.exports.postLend = ( req, res, next ) => {
    Joi.object({

        book_id: bookSchema.book_id.required(),
        title: bookSchema.title.required(),
        author: bookSchema.author.required(),
        edition: bookSchema.edition.required(),
        email: userSchema.email.required(),

    }).validateAsync( req.body )
        .then( _ => next() )
        .catch( err => resRender( res, "borrower/lendBookPage", {
            ...req.body, _id: req.body.book_id,
            popup: { typ:"warning", msg: err.details[0].message }
            }, resErrType.validationErr,
        ));
}

module.exports.postReturn = ( req, res, next ) => {
    Joi.object({

        lend_id: bookSchema.book_id.required(),

    }).validateAsync( req.body )
        .then( _ => next() )
        .catch( err => res.redirect( "/user?" + 
            'popTyp=warning' +
            `&popMsg=${err.details[0].message}`
         ));
}


module.exports.postReIssue = ( req, res, next ) => {
    Joi.object({

        lend_id: bookSchema.book_id.required(),

    }).validateAsync( req.body )
        .then( _ => next() )
        .catch( err => res.redirect( "/user?" + 
            'popTyp=warning' +
            `&popMsg=${err.details[0].message}`
         ));
}
