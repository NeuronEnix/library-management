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
        { $project: { name:1, email:1, contact:1 } },
        { $addFields: { borrowed: 10, overDue: 1, user_id: "$_id" } },
        { $project: { _id:0 } },
    ])

    return resRender( res, "user/userPage", {
        navBar: { active: "Book" },
        userMiniCardData: await userData,
        userMiniCardButtons: [
            { method: "get", action: "/book", label: "Lend" },
            { method: "get", action: "/book/return", label: "Return" },
            { method: "get", action: "/user/status", label: "Status" },
        ],
        eleKeyValPair: req.query,
        pg: req.query.pg
    });

}