require( "dotenv" ).config();

// npm modules
const path = require( "path" );
const express = require("express");
const cookieParser = require('cookie-parser')
var favicon = require('serve-favicon')

// handler
const {
    dbHandler, reqHandler, resHandler, sessionHandler
} = require( "./handler" );

// Initializing stuffs
dbHandler.connectToDatabase(); 

// Express setup
const app = express();
app.use( favicon( path.join( __dirname, 'public', 'favicon.ico' ) ) );
app.use(express.static(__dirname + '/public'));
app.use( cookieParser() );
app.use( sessionHandler.sessionForExpress );
app.use( express.json() );
app.use( express.urlencoded({extended:true}) );

app.set( 'view engine', 'ejs' );

app.use( reqHandler.reqLogger );


// // Resource API
app.use( require( "./api" ) );


// Invalid / Unknown API
app.use( ( req, res ) => {
    try {
        resHandler.resErr( res, resHandler.resErrType.invalidAPI );
    } catch ( err ) {
        if ( err.code === "ERR_HTTP_HEADERS_SENT" )
            console.log( "Response was already sent for url:", req.url );
            console.log( {...res._log} );
    }
} );

// all uncaught error handler
app.use( resHandler.uncaughtErrHandler );

// Run the server
const PORT = process.env.PORT || 8080
app.listen( PORT, () => console.log( "Server listening at:", PORT ) );
