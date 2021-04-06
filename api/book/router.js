const router = require( "express" ).Router();
const controller = require( "./controller" );
const validate = require( "./validation" );
const { resRender } = require( "../../handler" ).resHandler;
const { isAuthenticated } = require( "../../handler").sessionHandler;


router.get( "/" , controller.bookPage );
router.get( "/profile" , controller.bookProfilePage );

router.get( "/add", ( req, res, next) => {
    return resRender( res, "book/addBook" );
});

router.post( "/add", isAuthenticated, validate.postAdd, controller.addBook );
router.post( "/edit", isAuthenticated, validate.postEditBook, controller.editBook );
router.post( "/update-status", isAuthenticated, validate.postUpdateStatus, controller.updateStatus );

module.exports = router;