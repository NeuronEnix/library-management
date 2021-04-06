const router = require( "express" ).Router();
const controller = require( "./controller" );

const { resRender } = require( "../../handler" ).resHandler;
const { isAuthenticated } = require( "../../handler").sessionHandler;

router.post( "/lend", controller.lendBook );
router.get( "/lend",  controller.lendBookPage );

router.post( "/return", controller.returnBook );
router.post( "/re-issue", controller.reIssueBook );

router.get( "/user-book", controller.userBookListPage );

module.exports = router;