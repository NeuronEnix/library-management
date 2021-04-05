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
    sts: { type: String, default:'l' },     // 'l' -> lent ; 'r' -> returned
});

lendSchema.statics.getMatchFilter = ( defaultMatchCondition, { borrowed, reissued, overDue, returned } ) => {
    
    if ( !returned ) defaultMatchCondition.push(  { $ne: [ "$sts", "r" ] } );

    if ( !overDue ) defaultMatchCondition.push( { $or: [
        { $gt: [ "$due_at", new Date() ] }, { $ne: [ "$sts", "l" ] }
    ]} );
    
    if ( !borrowed ) defaultMatchCondition.push( { $or: [
        { $lt: [ "$due_at", new Date() ] }, { $ne: [ "$sts", "l" ] }
    ]} );

    return { $expr: { $and: defaultMatchCondition } };
    
}
const LendModel = mongoose.model( 'lends', lendSchema ) ;
module.exports = LendModel;
