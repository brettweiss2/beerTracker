const dbConnection = require("./mongoConnection");


const getCollectionFn = collection => {
    let _col = undefined;


    return async () => {
        if (!_col) {
            const db = await dbConnection();
            _col = await db.collection(collection);
        }

        return _col;
    }
}

module.exports = {
    beers: getCollectionFn("beers"),
    users: getCollectionFn("users"),
    reviews: getCollectionFn("reviews"),
    comments: getCollectionFn("comments")
}