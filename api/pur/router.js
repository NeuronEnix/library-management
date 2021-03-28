const router = require( "express" ).Router();
const controller = require( "./controller" );

const { resRender } = require( "../../handler" ).resHandler;

router.post( "/pur", controller.purchaseBook );

router.get( "/pur", ( req, res, next ) => {
    return resRender( res, "book/book" );
});

module.exports = router;