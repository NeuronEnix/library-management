const mongoose = require( 'mongoose' ) ;
const moment = require( "moment" );

const { ObjectId } = mongoose.Schema.Types;
const issueSchema = new mongoose.Schema ({
    user_id: { type: ObjectId, index: true },
    book_id: { type: ObjectId, index: true },
    iss_at: { type: Date, default: moment() },
    due_at: { type: Date, default: moment().add( 7, "days" ) },
    ret_at: { type: Date },
    sts: { type: String, default:'i' },     // 'i' -> issued ; 'r' -> returned
});

const IssueModel = mongoose.model( 'issue', issueSchema ) ;
module.exports = IssueModel;
