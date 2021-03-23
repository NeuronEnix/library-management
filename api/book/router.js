const router = require( "express" ).Router();
const controller = require( "./controller" );

const { softAuthorize } = require( "../../handler").tokenHandler;
// const validate = require( "./validation" );

router.post( "/add", softAuthorize, controller.addBook );
router.get( "/list", controller.bookList );

module.exports = router;