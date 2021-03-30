const UserModel = require( "../model" );
const { resRender } = require( "../../../handler").resHandler;

const { noOfUserListPerPage } = require( "../../../config").user;

module.exports = async( req, res, next) => {
    req.query.pg = req.query.pg ? parseInt( req.query.pg ) : 0;
    const { pg, email } = req.query;

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

        { $project: { name:1, email:1, contact:1, trackers:1 } },
        { $addFields: { user_id: "$_id" } },
        { $project: { _id:0 } },
    ])

    
    return resRender( res, "user/userPage", {
        userMiniCardData: await userData,
        userMiniCardButtons: [
            { method: "get", action: "/book", label: "Lend" },
            { method: "get", action: "/book/return", label: "Return" },
            { method: "get", action: "/user/view", label: "View" },
        ],
        eleKeyValPair: req.query,
        pg: req.query.pg
    });

}