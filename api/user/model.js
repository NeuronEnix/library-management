const mongoose = require( 'mongoose' ) ;
const { defaultUser } = require( "../../config" ).user

var userSchema = new mongoose.Schema ({
    email: { type: String, lowercase: true, index: { unique: true } },
    pass: String,
    name: String,
    contact: { type: Number, index: { unique: true} },
    typ: { type: String, default: "c" }, // c->customer; e->employee;
    sts: { type: String, default:'e' },     // 'e' -> enabled ; 'd' -> disabled
});

const User = mongoose.model( 'users', userSchema ) ;
module.exports = User;

User.estimatedDocumentCount( ( err, count ) => {
    if ( err ) return console.log( err );
    if ( count === 0 ) {
        const userDoc = new User();
        Object.assign( userDoc, defaultUser );
        userDoc.save();
    }
} );