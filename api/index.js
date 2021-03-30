const router = require( "express" ).Router();

router.get( "/", ( req, res ) => {
    if ( !req.session.uid ) return res.redirect( "/user/sign-in" );
    else return res.redirect( "/user/home" );
});

router.use( "/user", require( "./user" ).UserRouter );

router.use( "/book", require( "./book" ).BookRouter );

router.use( "/book", require( "./lend" ).LendRouter );

router.use( "/book", require( "./pur" ).PurchaseRouter );

module.exports = router;
