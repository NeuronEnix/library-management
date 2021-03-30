const router = require( "express" ).Router();
const controller = require( "./controller" );
const { resRender } = require( "../../handler" ).resHandler;
const { isAuthenticated } = require( "../../handler").sessionHandler;


router.get( "/" , controller.bookPage );
router.get( "/view" , controller.bookViewPage );

router.get( "/add", ( req, res, next) => {
    return resRender( res, "book/addBook" );
});

router.post( "/add", isAuthenticated, controller.addBook );
router.get( "/list", controller.bookList );
router.get( "/search", controller.searchBook );




module.exports = router;