const Joi = require("joi");
const { validate } = require( "../../handler" ).validationHandler;
const schema = {
    email: Joi.string().min(1).max(10),//.email({minDomainSegments:2, tlds:{allow:["com","net"]}}),
    pass: Joi.string().alphanum().min(1).max(15),
    name: Joi.string().min(1).max(50).trim(),
    contact: Joi.number().min(1).max(10),
}

const registerSchema = Joi.object({
    email: schema.email.required(),
    name: schema.name.required(),
    contact: schema.contact.required(),
});

const signInSchema = Joi.object({
    email: schema.email.required(),
    pass: schema.pass.required(),
});

module.exports.register = ( req, res, next ) => validate( res, next, registerSchema, req.body );
module.exports.signIn = ( req, res, next ) => validate( res, next, signInSchema, req.body );

