const UserModel = require( "../model" );

const { resOk, resErr, resErrType, resRender } = require( "../../../handler").resHandler;
module.exports = async ( req, res, next ) => {
    const { user_id, email, name, contact } = req.body;
    try {
        ;
        await UserModel.updateOne( { _id: user_id }, { $set: { email, name, contact } } );
        const query = `user_id=${user_id}&popTyp=success&popMsg=User Edited`;

        res.redirect( "/user/profile?" + query );
        
    } catch ( err ) {
        if ( err.code === 11000 ) {
            const popTyp = "warning";
            const popMsg = `Email:${email} Or Contact:${ contact } - Already Exist!`;
            return res.redirect( "/user/profile" + `?user_id=${user_id}&popTyp=${popTyp}&popMsg=${popMsg}` );
        }

        return resErr( res, resErrType.unknownErr, { infoToServer:err } );
        
    }
}