const mongoCollections = require('../config/mongoCollections');
const beers = mongoCollections.beers;
const users = require('./users');
const uuid = require('uuid/v4');


const exportedMethods = {
    
    async addBeer(name,type,abv,malt,hops,notes){
        if (typeof name !== 'string') throw 'No name provided';
        if (typeof type !== 'string') throw 'No type provided';
        if (typeof abv !== 'number') throw 'You need provide the abv with a number input';
        if (typeof malt !== 'string') throw 'No malt provided';
        if (typeof hops !== 'string') throw 'No hops provided';
        if (!Array.isArray(notes)) {
            notes = [];
        }

        const beerCollection = await beers;

        const newBeer = {
            name: name,
            type: type,
            abv: abv,
            malt: malt,
            hops: hops,
            notes: notes,
            _id: uuid()
        };

        const newInsertInformation = await beerCollection.insertOne(newBeer);
        const newId = newInsertInformation.insertedId;

        return await this.getBeerById(newId);



    },
    
    
    async getAllBeers() {
        const postCollection = await beers();
        return await postCollection.find({}).toArray();
    },

    async getBeerById(id) {
        const beerCollection = await beers;
        const beer = await beerCollection.findOne({_id: id});

        if(!beer) throw "Beer not found";
        return beer;
    }
}
