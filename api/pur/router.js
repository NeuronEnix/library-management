const router = require( "express" ).Router();
const controller = require( "./controller" );

const { resRender } = require( "../../handler" ).resHandler;

router.post( "/book", controller.purchaseBook );

router.get( "/book", ( req, res, next ) => {
    return resRender( res, "book/book" );
});

module.exports = router;