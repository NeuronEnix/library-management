const bcrypt = require( "bcrypt" );

const UserModel = require("../model");
const { resOk, resErr, resErrType, resRender } = require( "../../../handler").resHandler;

module.exports = async function signIn( req, res, next ) {    

    try {
        const { email, pass } = req.body;
        const userDoc = await UserModel.findOne( { email }, { _id:1, name:1, pass:1 } )

        // if user not found or pass is incorrect
        if ( !userDoc || await bcrypt.compare( pass, userDoc.pass ) === false ) {
            const popup = { typ: "danger", msg: 'Invalid Email or Password' };
            const eleKeyValPair = { email: req.body.email }; 
            return resRender( res, "signIn", { popup, eleKeyValPair }, resErrType.invalidCred );
        }
            // return resErr( res, resErrType.invalidCred, { infoToClient: "Email or Password Incorrect" } );

        req.session.uid = userDoc._id;
        req.session.name = userDoc.name;
        return resRender( res, "home" );
        // return resOk( res, "Logged In" );
        
    } catch ( err ) {
        return resErr( res, resErrType.unknownErr, { infoToServer:err } );
    }
}
