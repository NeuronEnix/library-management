const router = require( "express" ).Router();
const controller = require( "./controller" );

router.post( "/lend", controller.lendBook );
router.post( "/return", controller.returnBook );

module.exports = router;