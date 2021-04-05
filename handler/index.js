module.exports = {
    dbHandler: require( "./dbHandler" ),
    reqHandler: require( "./reqHandler" ),
    resHandler: require( "./resHandler" ),
    validationHandler: require( "./validationHandler" ),
    sessionHandler: require( "./sessionHandler/session.config"),
    pagination: {
        evaluatePageNo: ( pg, pgAction ) => {
            pg = pg ? parseInt( pg ) : 0;
            if ( pgAction === "next" ) ++pg;
            else if ( pgAction === "prev" && pg > 0 ) --pg;
            return pg;
        }
    }
}
