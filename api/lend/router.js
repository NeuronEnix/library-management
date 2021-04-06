const router = require( "express" ).Router();
const controller = require( "./controller" );

const validate = require( "./validation" );

router.post( "/lend", validate.postLend, controller.lendBook );
router.get( "/lend",  controller.lendBookPage );

router.post( "/return", validate.postReturn, controller.returnBook );
router.post( "/re-issue", validate.postReIssue, controller.reIssueBook );

router.get( "/user-book", controller.userBookListPage );

module.exports = router;