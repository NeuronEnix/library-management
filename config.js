const bcrypt = require( "bcrypt" );

module.exports = {

    user: {
        maxConcurrentSignInCount: 1,
        defaultUser: {
            email: "a",
            pass: bcrypt.hashSync( "a", 10 ),
            name: "a",
            typ: "e",
        },
        noOfUserListPerPage: 8,
        noOfBookHistoryListPerPage: 20,
    },
    
    book: {
        noOfBookListPerPage: 8,
        noOfUserHistoryListPerPage: 20,
    },

    lend: {
        maxBookLendPerUser: 5,
    },
}