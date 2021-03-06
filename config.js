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

    lend: { 
        noOfReturnBookListPerPage: 8,
        maxBookLendPerUser: 5,
    },
    
    book: {
        noOfBookListPerPage: 8,
        noOfUserHistoryListPerPage: 20,
    },

}