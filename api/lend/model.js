const mongoose = require( 'mongoose' ) ;
const moment = require( "moment" );

const UserModel = require( '../user/model' );

const { ObjectId } = mongoose.Schema.Types;
const lendSchema = new mongoose.Schema ({
    lender_id: { type: ObjectId, index: true },
    borrower_id: { type: ObjectId, index: true },
    book_id: { type: ObjectId, index: true },
    lent_at: { type: Date, default: moment() },
    due_at: { type: Date, default: moment().add( 7, "days" ) },
    ret_at: { type: Date },
    re_iss: { type: [mongoose.Schema.Types.Date], default: [] },
    sts: { type: String, default:'l' },     // 'l' -> lent ; 'r' -> returned
});

lendSchema.statics.getMatchFilter = ( defaultMatchCondition, { borrowed, reissued, overDue, returned } ) => {
    
    if ( !returned ) defaultMatchCondition.push(  { $ne: [ "$sts", "r" ] } ); // to match everything but return
    
    if ( !overDue ) defaultMatchCondition.push( { $or: [
        { $gt: [ "$due_at", new Date() ] }, // to match borrowed and re-issued
        { $ne: [ "$sts", "l" ] } // to match returned
    ]} );
    
    if ( !reissued ) defaultMatchCondition.push( { $or: [
        { $eq: [ { $size: "$re_iss" }, 0 ] }, // to match borrowed
        { $lt: [ "$due_at", new Date() ] },  // to math over due
        { $ne: [ "$sts", "l" ] } // to match returned
    ]} );
    
    if ( !borrowed ) defaultMatchCondition.push( { $or: [
        { $ne: [ { $size: "$re_iss" }, 0 ] }, // to match re-issued
        { $lt: [ "$due_at", new Date() ] }, // to math over due
        { $ne: [ "$sts", "l" ] } // to match returned
    ]} );

    return { $expr: { $and: defaultMatchCondition } };
    
}
const LendModel = mongoose.model( 'lends', lendSchema ) ;
module.exports = LendModel;
