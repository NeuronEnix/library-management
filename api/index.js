const router = require( "express" ).Router();

const { isAuthenticated } = require( "../handler").sessionHandler;
router.get( "/", isAuthenticated, ( req, res ) => { return res.redirect( "/user/home" ) });

router.use( "/user", require( "./user" ).UserRouter );

router.use( "/book", isAuthenticated, require( "./book" ).BookRouter );

router.use( "/book", isAuthenticated, require( "./lend" ).LendRouter );

router.use( "/book", isAuthenticated, require( "./pur" ).PurchaseRouter );

module.exports = router;
