const mongoose = require( 'mongoose' ) ;

var userSchema = new mongoose.Schema ({
    email: { type: String, index: { unique: true } },
    pass: String,
    name: String,
    typ: { type: String, default: "c" }, // c->customer; e->employee;
    sts: { type: String, default:'a' },     // 'a' -> active ; 'd' -> disabled
});

const User = mongoose.model( 'users', userSchema ) ;
module.exports = User;
