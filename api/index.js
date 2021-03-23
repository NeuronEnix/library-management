const router = require( "express" ).Router();

router.use( "/user", require( "./user" ).UserRouter );

router.use( "/book", require( "./book" ).BookRouter );

router.use( "/book", require( "./lend" ).LendRouter );

router.use( "/pur", require( "./pur" ).PurchaseRouter );

module.exports = router;
