const mongoose = require("mongoose");
const BookModel = require( "../model" );

const { noOfUserHistoryListPerPage } = require( "../../../config").book;

const { resRender } = require( "../../../handler").resHandler;

module.exports = async( req, res, next) => {

    const { pg = 0, book_id } = req.query;

    const noOfDocToBeSkipped = pg * noOfUserHistoryListPerPage;

    const bookProfileData = await BookModel.aggregate([
        { $match: { _id: mongoose.Types.ObjectId( book_id ) } },
        { $project: { _id:1, qty:1, author:1, title:1, edition:1 } },
        { $lookup: {
            from: "lends",
            let: { book_id: "$_id" },
            pipeline: [
                { $match: { $expr: { $eq: [ "$book_id", "$$book_id" ] } } },
                { $project: { lent_at:1, due_at:1, ret_at:1, sts:1, _id:0 } },
                { $group: {
                    _id: null,
                    lifeTimeBorrow: { $sum: 1 },
                    lifeTimeOverDue: { $sum: { $cond: [ { $gt: [ "$ret_at", "$due_at" ] }, 1, 0 ] } },
                    borrowed: { $sum: { $cond: [ { $eq: [ "$sts", "l" ] }, 1, 0 ] } },
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
                { $match: { $expr: { $eq: [ "$book_id", "$$book_id" ] } } },
                { $project: { lent_at:1, due_at:1, ret_at:1, sts:1, borrower_id:1, _id:0 } },
                { $sort: { lent_at:-1 } },
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
                            ],
                            default: "primary",
                            },
                        },
                        name: "$userDoc.name",
                        lent_at: { $dateToString: { date: "$lent_at",format: "%d-%m-%Y", timezone: "+05:30", onNull: "NULL" } },
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
    
    return resRender( res, "book/bookProfilePage", bookProfileData[0] );

}