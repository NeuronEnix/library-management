const router = require( "express" ).Router();
const controller = require( "./controller" );

const { softAuthorize } = require( "../../handler").tokenHandler;
// const validate = require( "./validation" );

router.post( "/lend", softAuthorize, controller.lendBook );
router.post( "/return", softAuthorize, controller.returnBook );

module.exports = router;