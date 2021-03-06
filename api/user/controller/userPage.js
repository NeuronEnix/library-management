const UserModel = require( "../model" );

const { resRender } = require( "../../../handler").resHandler;
const { noOfUserListPerPage } = require( "../../../config").user;
const { evaluatePageNo } = require( "../../../handler").pagination;

module.exports = async( req, res, next) => {
    const { email="" } = req.query;

    const pg = evaluatePageNo( req.query.pg, req.query.pgAction );
    const noOfDocToBeSkipped = pg * noOfUserListPerPage;

    const userData = UserModel.aggregate([
        { $match: { email: new RegExp( email, "i" ) } },
        { $skip: noOfDocToBeSkipped || 0 },
        { $limit: noOfUserListPerPage || 10 },
        { $lookup: {
            from: "lends",
            let: { borrower_id: "$_id" },
            pipeline: [
                { $match:
                    { $expr:
                        { $and: [
                            { $eq: [ "$borrower_id", "$$borrower_id" ] },
                            { $eq: [ "$sts", "l" ] },
                        ]}
                    }
                },
                { $group: {
                    _id: null,
                    borrowed: { $sum : 1 },
                    overDue: { $sum: { $cond: [ { $lt: [ "$due_at", new Date() ] }, 1, 0 ] } },
                }},
                { $project: { _id:0 } },
            ],
            as: "trackers"
        }},
        { $unwind: {
            path : "$trackers",
            preserveNullAndEmptyArrays: true
        } },

        { $project: { _id:0, user_id: "$_id", name:1, email:1, contact:1, trackers: { $ifNull: [ "$trackers", { borrowed:0, overDue:0 } ] }, } },
    ])

    
    return resRender( res, "user/userPage", {
        pg, email,
        miniCardDataList: await userData,
    });

}