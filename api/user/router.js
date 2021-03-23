const router = require( "express" ).Router();
const controller = require( "./controller" );
const validate = require( "./validation" );

router.post( "/reg-cst", validate.signUp, controller.regCustomer );
router.post( "/sign-in", validate.signIn, controller.signIn  );
// router.post( "/signOut", controller.signOut );

module.exports = router;