const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const users = data.users;
const beers = data.beers;
const reviews = data.reviews;

const main = async () => {
	const db = await dbConnection();
	await db.dropDatabase();

    let brett = await users.addUser("bweiss@stevens.edu", "password", "Brett", "Weiss", "Pine Beach", "New Jersey", "USA");
    await users.addUser("john@smith.com", "pw", "John", "Smith", "NYC", "NY", "USA");
    let monkey = await beers.addBeer("Sour Monkey", "Sour Brett Tripel", 9.5, ["Pilsner"], ["Tettnang"], "Fruity notes from imported Belgian yeast swirl through a precise souring");
    await beers.addComment(monkey._id.toString(), brett._id.toString(), "my favorite beer");
    await reviews.addReview(brett._id.toString(), monkey._id.toString(), 5, "strong and tastes great");

	console.log('Done seeding database');
	await db.serverConfig.close();
};

main().catch(console.log);