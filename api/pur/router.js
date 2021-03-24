const router = require( "express" ).Router();
const controller = require( "./controller" );

router.post( "/book", controller.purchaseBook );

module.exports = router;