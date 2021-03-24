const router = require( "express" ).Router();
const controller = require( "./controller" );

router.post( "/add", controller.addBook );
router.get( "/list", controller.bookList );
router.get( "/search", controller.searchBook );

module.exports = router;