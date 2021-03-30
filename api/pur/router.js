const router = require( "express" ).Router();
const controller = require( "./controller" );

const { resRender } = require( "../../handler" ).resHandler;

router.post( "/purchase", controller.purchaseBook );

router.get( "/purchase", ( req, res ) => {
    resRender( res, "book/purchaseBookPage", { ...req.query });
} );

module.exports = router;