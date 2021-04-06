const Joi = require("joi");
const { resRender, resErrType } = require( "../../handler" ).resHandler;

const schema = {
    user_id: Joi.string().alphanum().min(24).max(24),
    sts: Joi.string().min(1).max(1),
    email: Joi.string().min(1).max(20),//.email({minDomainSegments:2, tlds:{allow:["com","net"]}}),
    pass: Joi.string().alphanum().min(1).max(15),
    name: Joi.string().min(1).max(10).trim(),
    contact: Joi.number().min(1).max(9999999999),
}

module.exports.userSchema = schema;

module.exports.postRegister = ( req, res, next ) => {
    Joi.object({

        email: schema.email.required(),
        name: schema.name.required(),
        contact: schema.contact.required(),

    }).validateAsync( req.body )
        .then( _ => next() )
        .catch( err => resRender( res, "user/registerPage", {
            ...req.body,
            popup: { typ:"warning", msg: err.details[0].message }
            }, resErrType.validationErr,
        ));
}

module.exports.postSignIn = ( req, res, next ) => {
    Joi.object({

        email: schema.email.required(),
        pass: schema.pass.required(),

    }).validateAsync( req.body )
        .then( _ => next() )
        .catch( err => resRender( res, "user/signInPage", {
            ...req.body,
            popup: { typ:"warning", msg: err.details[0].message }
            }, resErrType.validationErr,
         ));
}

module.exports.postUpdateStatus = ( req, res, next ) => {
    Joi.object({

        user_id: schema.user_id.required(),
        sts: schema.sts.required(),

    }).validateAsync( req.body )
        .then( _ => next() )
        .catch( err => res.redirect( "/user/profile" + 
            `?user_id=${req.body.user_id}` +
            '&popTyp=warning' +
            `&popMsg=${err.details[0].message}`
         ));
}

module.exports.postEditUser = ( req, res, next ) => {
    Joi.object({

        user_id: schema.user_id.required(),
        email: schema.email.required(),
        name: schema.name.required(),
        contact: schema.contact.required(),
        editable: Joi.string().valid( 'true', 'false' ).required(),

    }).validateAsync( req.body )
        .then( _ => next() )
        .catch( err => res.redirect( "/user/profile" + 
            `?user_id=${req.body.user_id}` +
            '&popTyp=warning' +
            `&popMsg=${err.details[0].message}`
         ));
}

