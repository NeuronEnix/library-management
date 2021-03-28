const bcrypt = require( "bcrypt" );

module.exports = {

    user: {
        maxConcurrentSignInCount: 1,
        defaultUser: {
            email: "a",
            pass: bcrypt.hashSync( "a", 10 ),
            name: "a",
            typ: "e"
        }
    },
    
    book: {
        noOfBookListPerPage: 8
    },

    lend: {
        maxBookLendPerUser: 5
    }
}