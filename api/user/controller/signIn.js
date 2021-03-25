const bcrypt = require( "bcrypt" );

const UserModel = require("../model");
const { resOk, resErr, resErrType } = require( "../../../handler").resHandler;

module.exports = async function signIn( req, res, next ) {    

    try {
        const { email, pass } = req.body;
        const userDoc = await UserModel.findOne( { email }, { _id:1, name:1, pass:1 } )

        // if user not found or pass is incorrect
        if ( !userDoc || await bcrypt.compare( pass, userDoc.pass ) === false )
            return res.render( "signIn", { signInError : { message: 'Invalid Email or Password' } } );
            // return resErr( res, resErrType.invalidCred, { infoToClient: "Email or Password Incorrect" } );

        req.session.uid = userDoc._id;
        return resOk( res, "Logged In" );
        
    } catch ( err ) {
        return resErr( res, resErrType.unknownErr, { infoToServer:err } );
    }
}
