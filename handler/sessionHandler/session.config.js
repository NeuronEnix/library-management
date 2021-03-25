const session = require('express-session');
const MongoStore = require( "connect-mongo" );
// const mongoose = require( "mongoose" );


const DB_URL = process.env.DB_URL || "mongodb://127.0.0.1:27017/lib" ;

const mongooseOption = {
    useNewUrlParser: true,  
    useUnifiedTopology: true,  
}

module.exports.sessionForExpress = session( {
    secret: process.env.SESSION_SECRET || "sessionSecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 10 * 24 * 60 * 60 * 1000 // 10 days in ms
    },
    store: MongoStore.create({
        mongoUrl: DB_URL,
        mongoOptions: mongooseOption
    })
});

module.exports.isAuthenticated = ( req, res, next ) => {
    if ( req.session.uid === undefined )
        return res.redirect( "/user/sign-in" );
        
    else next();
}