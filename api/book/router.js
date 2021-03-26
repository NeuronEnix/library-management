const router = require( "express" ).Router();
const controller = require( "./controller" );
const { resRender } = require( "../../handler" ).resHandler;
const { isAuthenticated } = require( "../../handler").sessionHandler;

router.post( "/add", isAuthenticated, controller.addBook );
router.get( "/list", controller.bookList );
router.get( "/search", controller.searchBook );

router.get( "/add", ( req, res, next) => {
    return resRender( res, "book/addBook" );
})

router.get( "/view" , ( req, res, next) => {
    return resRender( res, "book/book" );
})
module.exports = router;