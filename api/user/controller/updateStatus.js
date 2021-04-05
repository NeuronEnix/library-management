const UserModel = require( "../model" );

const { resOk, resErr, resErrType, resRender } = require( "../../../handler").resHandler;
module.exports = async ( req, res, next ) => {
    try {
        
        const { user_id, sts } = req.body;

        switch ( sts ) {
            case "e": popTyp = "success"; popMsg = "User Enabled"; break;
            case "d": popTyp = "danger"; popMsg = "User Disabled"; break;
        }

        await UserModel.updateOne( { _id: user_id }, { $set: { sts } } );

        const query = `user_id=${user_id}&popTyp=${popTyp}&popMsg=${popMsg}`;

        res.redirect( "/user/profile?" + query );
        
    } catch ( err ) {
        return resErr( res, resErrType.unknownErr, { infoToServer:err } );
    }
}