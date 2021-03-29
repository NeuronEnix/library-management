const bcrypt = require( "bcrypt" );
const User = require("../model");
const { resOk, resErr, resErrType, resRender } = require( "../../../handler").resHandler;
module.exports = async function regCustomer( req, res, next ) {    

    try {
        const userDoc = new User();
        Object.assign( userDoc, req.body );
        await userDoc.save();

        return resRender( res, "user/registerPage", {
            popup: { typ: "success", msg: "Email Registered!" },
            navBar: { active: "Register User" },
            eleKeyValPair: req.body,
            disableInput: true,
        });

        return resOk( res );

    } catch ( err ) {
        if ( err.code === 11000 ) {
            return resRender( res, "user/registerPage", {
                popup: { typ: "warning", msg: "Email Already Registered" },
                navBar: { active: "Register User" },
                eleKeyValPair: req.body,
                disableInput: true,
            });
            // return resErr( res, resErrType.duplicateErr, { infoToClient: "Email already exist" } );
        } 
        return resErr( res, resErrType.unknownErr, { infoToServer:err } );
    }
}