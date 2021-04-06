const mongoose = require("mongoose");
const BookModel = require( "../model" );
const LendModel = require( "../../lend/model" );

const { noOfUserHistoryListPerPage } = require( "../../../config").book;
const { evaluatePageNo } = require( "../../../handler").pagination;
const { resRender } = require( "../../../handler").resHandler;

module.exports = async( req, res, next) => {

    const { book_id, editable=false } = req.query;

    const pg = evaluatePageNo( req.query.pg, req.query.pgAction );
    const noOfDocToBeSkipped = pg * noOfUserHistoryListPerPage;

    let { borrowed, reissued, overDue, returned } = req.query;

    const allTheFilter = borrowed || reissued || overDue || returned;
    if ( allTheFilter === undefined ) borrowed = reissued = overDue = returned = 'on';

    const bookProfileData = await BookModel.aggregate([
        { $match: { _id: mongoose.Types.ObjectId( book_id ) } },
        { $project: { _id:1, qty:1, author:1, title:1, edition:1, sts:1 } },
        { $lookup: {
            from: "lends",
            let: { book_id: "$_id" },
            pipeline: [
                { $match: { $expr: { $eq: [ "$book_id", "$$book_id" ] } } },
                { $project: { lent_at:1, due_at:1, re_iss:1, ret_at:1, sts:1, _id:0 } },
                { $group: {
                    _id: null,
                    lifeTimeBorrow: { $sum: 1 },
                    lifeTimeReIssue: { $sum: { $size: "$re_iss" } },
                    lifeTimeOverDue: { $sum: { $cond: [ { $gt: [ "$ret_at", "$due_at" ] }, 1, 0 ] } },
                    borrowed: { $sum: { $cond: [ { $eq: [ "$sts", "l" ] }, 1, 0 ] } },
                    reissued: { $sum: { $cond: [
                        { $and: [
                            { $eq: [ "$sts", "l" ] },
                            { $gt: [ { $size: "$re_iss" }, 0 ] },
                            
                        ]},
                        1, 0 ], 
                    }},
                    overDue: { $sum: { $cond: [
                        { $and: [
                            { $eq: [ "$sts", "l" ] },
                            { $lt: [ "$due_at", new Date() ] },
                        ]},
                        1, 0 ],
                    }},
                }},
                { $project: { _id:0 } },
            ],
            as: "trackers",
        }},
        { $unwind: { path : "$trackers", preserveNullAndEmptyArrays: true } },
        { $lookup: { 
            from: "lends",
            let: { book_id: "$_id" },
            pipeline: [
                { $match: LendModel.getMatchFilter(
                    [ { $eq: [ "$book_id", "$$book_id" ] } ],
                    { borrowed, reissued, overDue, returned },
                )},
                { $project: { lent_at:1, due_at:1, ret_at:1, re_iss:1, sts:1, borrower_id:1, _id:0 } },
                { $sort: { due_at:-1 } },
                { $skip: noOfDocToBeSkipped || 0 },
                { $limit: noOfUserHistoryListPerPage || 20 },
                { $lookup: {
                    from: "users",
                    let: { user_id: "$borrower_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: [ "$_id", "$$user_id" ] } } },
                        { $project: { name:1, _id:0 } }
                    ],
                    as: "userDoc"
                }},
                { $unwind: "$userDoc" },
                { $group: {
                    _id: null,
                    history: { $push: { 
                        color: {
                            $switch: {
                            branches: [
                                { case: { $eq: [ "$sts", "r" ] }, then: "success" },
                                { case: { $lt: [ "$due_at", new Date() ] }, then: "danger" },
                                { case: { $gt: [ { $size: "$re_iss" }, 0 ] }, then: "warning" },
                            ],
                            default: "primary",
                            },
                        },
                        name: "$userDoc.name",
                        lent_at: { $dateToString: { date: "$lent_at",format: "%d-%m-%Y", timezone: "+05:30", onNull: "NULL" } },
                        re_iss_at: { $dateToString: { date: { $last: "$re_iss" } ,format: "%d-%m-%Y", timezone: "+05:30", onNull: "No Reissue" } },
                        due_at: { $dateToString: { date: "$due_at",format: "%d-%m-%Y", timezone: "+05:30", onNull: "NULL" } },
                        ret_at: { $dateToString: { date: "$ret_at",format: "%d-%m-%Y", timezone: "+05:30", onNull: "Not Returned" } },
                    }},
                }},
                { $unwind: "$history" },
            ],
            as: "history",
        }},
        { $addFields: { "trackers.avail": "$qty", "trackers.history" : "$history.history" } },
        { $project: { _id:0, qty:0, history:0 } },
    ]);

    bookProfileData[0].book_id = book_id;
    
    const dataToBeSent =  { 
        pg, ...bookProfileData[0], editable,
        filter: { borrowed, reissued, overDue, returned } 
    };
    if ( req.query.popTyp ) dataToBeSent.popup = {
        typ: req.query.popTyp, msg:req.query.popMsg
    }
    return resRender( res, "book/bookProfilePage", dataToBeSent );

}