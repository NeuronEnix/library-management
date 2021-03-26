const mongoose = require( "mongoose" );
//Fixes all deprecation warnings
const mongooseOption = {
    useNewUrlParser: true,  
    useCreateIndex: true,  
    useUnifiedTopology: true,
    autoIndex: true,  
}
// mongoose.set( 'useFindAndModify'   , false ) ;

// Connects to DB
const DB_URL = process.env.DB_URL || "mongodb://127.0.0.1:27017/lib"
module.exports.connectToDatabase = () => {
    mongoose.connect( DB_URL, mongooseOption ) 
        .then  ( val => { console.log('Connected to DB' ); } )
        .catch ( err => { console.log('Not Connected to DB', err ); } );
}
