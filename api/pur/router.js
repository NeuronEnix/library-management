const router = require( "express" ).Router();
const controller = require( "./controller" );

const { softAuthorize } = require( "../../handler").tokenHandler;
// const validate = require( "./validation" );

router.post( "/book", softAuthorize, controller.purchaseBook );

module.exports = router;