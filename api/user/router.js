const router = require( "express" ).Router();
const controller = require( "./controller" );
const validate = require( "./validation" );
const { isAuthenticated } = require( "../../handler").sessionHandler;
const { resRender } = require( "../../handler" ).resHandler;

router.post( "/sign-in",                    validate.postSignIn, controller.signIn );
router.post( "/register", isAuthenticated,  validate.postRegister, controller.register );
router.post( "/update-status", isAuthenticated, validate.postUpdateStatus, controller.updateStatus );
router.post( "/edit", isAuthenticated, validate.postEditUser, controller.editUser );


router.get( "/", isAuthenticated, controller.userPage );
router.get( "/profile" , isAuthenticated, controller.userProfilePage );

router.get( "/register", isAuthenticated, ( req, res ) => {
    return resRender( res, "user/registerPage" );
});

router.get( "/sign-in", ( req, res ) => {
    return resRender( res, "user/signInPage" );
});

router.get( "/home", ( req, res ) => {
    return resRender( res, "home" );
});

module.exports = router;