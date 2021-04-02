const mongoose = require("mongoose");
const UserModel = require( "../model" );

const { noOfBookHistoryListPerPage } = require( "../../../config").user;

const { resRender } = require( "../../../handler").resHandler;

module.exports = async( req, res, next) => {

    const { pg = 0 } = req.query;

    const noOfDocToBeSkipped = pg * noOfBookHistoryListPerPage;

    // const userProfileData = await UserModel.aggregate([
    //     { $match: { email:req.query.email } },
    //     { $project: { _id:1, name:1, email:1, contact:1 } },
    //     { $lookup: {
    //         from: "lends",
    //         let: { user_id: "$_id" },
    //         pipeline: [
    //             { $match: { $expr: { $eq: [ "$borrower_id", "$$user_id" ] } } },
    //             { $sort: { lent_at:-1 } },
    //             { $skip: noOfDocToBeSkipped || 0 },
    //             { $limit: noOfBookHistoryListPerPage || 20 },
    //             { $lookup: {
    //                 from: "books",
    //                 let: { book_id: "$book_id" },
    //                 pipeline: [
    //                     { $match: { $expr: { $eq: [ "$_id", "$$book_id" ] } } },
    //                     { $project: { title:1, _id:0 } }
    //                 ],
    //                 as: "bookDoc"
    //             }},
    //             { $unwind: "$bookDoc" },
    //             { $group: {
    //                 _id: null,
    //                 lifeTimeBorrow: { $sum: 1 },
    //                 lifeTimeOverDue: { $sum: { $cond: [ { $gt: [ "$ret_at", "$due_at" ] }, 1, 0 ] } },
    //                 borrowed: { $sum: { $cond: [ { $eq: [ "$sts", "l" ] }, 1, 0 ] } },
    //                 overDue: { $sum: { $cond: [
    //                     { $and: [
    //                         { $eq: [ "$sts", "l" ] },
    //                         { $lt: [ "$due_at", new Date() ] },
    //                     ]},
    //                     1, 0 ] 
    //                 }},
    //                 history: { $push: { 
    //                     color: {
    //                         $switch: {
    //                         branches: [
    //                             { case: { $eq: [ "$sts", "r" ] }, then: "success" },
    //                             { case: { $lt: [ "$due_at", new Date() ] }, then: "danger" },
    //                         ],
    //                         default: "primary",
    //                         }
    //                     },
    //                     title: "$bookDoc.title",
    //                     lent_at: { $dateToString: { date: "$lent_at",format: "%d-%m-%Y", timezone: "+05:30", onNull: "NULL" } },
    //                     due_at: { $dateToString: { date: "$due_at",format: "%d-%m-%Y", timezone: "+05:30", onNull: "NULL" } },
    //                     ret_at: { $dateToString: { date: "$ret_at",format: "%d-%m-%Y", timezone: "+05:30", onNull: "Not Returned" } },
    //                 }},
    //             }},
    //             { $project: { _id:0,  } },
    //         ],
    //         as: "trackers",
    //     }},
    //     { $unwind: {
    //         path : "$trackers",
    //         preserveNullAndEmptyArrays: true
    //     } },
    //     { $project: { _id:0 } },
    // ]);

    const userProfileData = await UserModel.aggregate([
        { $match: { _id: mongoose.Types.ObjectId( req.query.user_id ) } },
        { $project: { _id:1, name:1, email:1, contact:1 } },
        { $lookup: {
            from: "lends",
            let: { user_id: "$_id" },
            pipeline: [
                { $match: { $expr: { $eq: [ "$borrower_id", "$$user_id" ] } } },
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
            let: { user_id: "$_id" },
            pipeline: [
                { $match: { $expr: { $eq: [ "$borrower_id", "$$user_id" ] } } },
                { $project: { lent_at:1, due_at:1, ret_at:1, sts:1, book_id:1, _id:0 } },
                { $sort: { lent_at:-1 } },
                { $skip: noOfDocToBeSkipped || 0 },
                { $limit: noOfBookHistoryListPerPage || 20 },
                { $lookup: {
                    from: "books",
                    let: { book_id: "$book_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: [ "$_id", "$$book_id" ] } } },
                        { $project: { title:1, _id:0 } }
                    ],
                    as: "bookDoc"
                }},
                { $unwind: "$bookDoc" },
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
                        title: "$bookDoc.title",
                        lent_at: { $dateToString: { date: "$lent_at",format: "%d-%m-%Y", timezone: "+05:30", onNull: "NULL" } },
                        due_at: { $dateToString: { date: "$due_at",format: "%d-%m-%Y", timezone: "+05:30", onNull: "NULL" } },
                        ret_at: { $dateToString: { date: "$ret_at",format: "%d-%m-%Y", timezone: "+05:30", onNull: "Not Returned" } },
                    }},
                }},
                { $unwind: "$history" },
            ],
            as: "history",
        }},
        { $addFields: { "trackers.history" : "$history.history" } },
        { $project: { _id:0, history:0 } },
    ]);

    if ( !userProfileData[0].trackers ) userProfileData[0].trackers = { history:[]};
    // if ( !userProfileData.trackers ) userProfileData.trackers = { borrowed:0 };
    userProfileData[0].user_id = req.query.user_id;
    return resRender( res, "user/userProfilePage", userProfileData[0] );

}