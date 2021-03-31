const router = require( "express" ).Router();
const controller = require( "./controller" );
const validate = require( "./validation" );

const { resRender } = require( "../../handler" ).resHandler;

router.post( "/register", validate.register, controller.register );
router.post( "/sign-in", validate.signIn, controller.signIn );


router.get( "/", controller.userPage );
router.get( "/profile" , controller.userProfilePage );

router.get( "/register", ( req, res ) => {
    return resRender( res, "user/registerPage" );
});

router.get( "/sign-in", ( req, res ) => {
    return resRender( res, "user/signInPage" );
});

router.get( "/home", ( req, res ) => {
    return resRender( res, "home" );
});
// router.post( "/signOut", controller.signOut );

module.exports = router;