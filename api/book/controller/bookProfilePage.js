const mongoose = require("mongoose");
const BookModel = require( "../model" );

const { resRender } = require( "../../../handler").resHandler;

module.exports = async( req, res, next) => {
    const data = await BookModel.aggregate([
        { $match: { _id: mongoose.Types.ObjectId( req.query.book_id ) } },
        { $project: { _id:1, qty:1 } },
        { $lookup: {
            from: "lends",
            let: { book_id: "$_id" },
            pipeline: [
                // { $addFields: {
                //     maxTime: "1",
                // } },
                { $match: { $expr: { $eq: [ "$book_id", "$$book_id" ] } } },
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
                        1, 0 ] } },
                    }},
                    { $project: { _id:0 } },
            ],
            as: "trackers",
        }},
        { $unwind: {
            path : "$trackers",
            preserveNullAndEmptyArrays: true
        } },
        { $addFields: { "trackers.avail": "$qty" } },
        { $project: { _id:0, qty:0 } },
    ]);
    
    return resRender( res, "book/bookProfilePage", {
        ...req.query, ...data[0]
        
    } );

}