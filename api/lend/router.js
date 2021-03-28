const router = require( "express" ).Router();
const controller = require( "./controller" );

const { resRender } = require( "../../handler" ).resHandler;
const { isAuthenticated } = require( "../../handler").sessionHandler;

router.post( "/lend", controller.lendBook );
router.get( "/lend", ( req, res ) => {
    resRender( res, "borrower/lendBookPage", {
        navBar: { active: "Book" },
        ...req.query
    });
} );

router.post( "/return", controller.returnBook );

module.exports = router;