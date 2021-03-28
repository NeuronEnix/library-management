const router = require( "express" ).Router();
const controller = require( "./controller" );

const { resRender } = require( "../../handler" ).resHandler;

router.post( "/purchase", controller.purchaseBook );

router.get( "/pur", ( req, res, next ) => {
    return resRender( res, "book/bookPage" );
});

module.exports = router;