const router = require( "express" ).Router();

router.use( "/user", require( "./user" ).UserRouter );

router.use( "/book", require( "./book" ).BookRouter );

module.exports = router;