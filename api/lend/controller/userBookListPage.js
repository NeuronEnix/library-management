const { UserModel }=require( "../../user" );
const { resRender } = require( "../../../handler").resHandler;
const { noOfReturnBookListPerPage } = require( "../../../config").lend;

module.exports = async( req, res, next) => {
    let { pg, pgAction, title="", author="", edition, email="" } = req.query;

    pg = pg ? parseInt( pg ) : 0;
    if ( pgAction === "next" ) ++pg;
    else if ( pgAction === "prev" && pg > 0 ) --pg;

    const noOfDocToBeSkipped = pg * noOfReturnBookListPerPage;
    const data = await UserModel.aggregate([
        { $match: { email } },
        { $project: { _id:1 } },
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
                { $project: {
                    lent_at: { $dateToString: { date: "$lent_at",format: "%d-%m-%Y", timezone: "+05:30", onNull: "NULL" } },
                    due_at: { $dateToString: { date: "$due_at",format: "%d-%m-%Y", timezone: "+05:30", onNull: "NULL" } },
                    lend_id: "$_id", book_id:1,  _id:0
                }},
                { $skip: noOfDocToBeSkipped || 0 },
                { $limit: noOfReturnBookListPerPage || 8 },
                { $lookup: {
                    from: "books",
                    let: { book_id: "$book_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: [ "$_id", "$$book_id" ] } } },
                        { $project: { title:1, author:1, edition:1, _id:0 } }
                    ],
                    as: "bookDoc",
                }},
                { $unwind: "$bookDoc" },
                { $project: { 
                    title: "$bookDoc.title", author: "$bookDoc.author", edition: "$bookDoc.edition", 
                    lend_id: 1, lent_at:1, due_at:1, 
                } },
            ],
            as: "lends",
        }},
        { $project: { _id:0 } },
    ])


    const pageData = {
        pg, title, author, edition, email,
        miniCardDataList: data[0].lends,
    };

    if ( req.query.popTyp ) pageData.popup = { typ: req.query.popTyp, msg: req.query.popMsg }
    
    if ( email && await UserModel.exists( { email } ) == false )
        pageData.popup = { typ: "warning", msg: "Email Not Registered!" };
        
    return resRender( res, "borrower/userBookListPage", pageData );

}