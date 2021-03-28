const router = require( "express" ).Router();
const controller = require( "./controller" );
const validate = require( "./validation" );

const { resRender } = require( "../../handler" ).resHandler;
router.post( "/reg-cst", validate.signUp, controller.regCustomer );
router.post( "/sign-in", validate.signIn, controller.signIn  );


router.get( "/sign-in", ( req, res ) => {
    return resRender( res, "signIn" );
});
router.get( "/home", ( req, res ) => {
    return resRender( res, "home" );
});
// router.post( "/signOut", controller.signOut );

module.exports = router;