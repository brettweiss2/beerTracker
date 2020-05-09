const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const users = data.users;
const beers = data.beers;
const reviews = data.reviews;

const main = async () => {
	const db = await dbConnection();
	await db.dropDatabase();

    //users

    //preset password same as lab 10 
    //elementarymydearwatson : $2a$16$7JKSiEmoP3GNDSalogqgPu0sUbwder7CAN/5wnvCWe6xCKAKwlTD.
    //damnyoujackdonaghy : $2a$16$SsR2TGPD24nfBpyRlBzINeGU61AH0Yo/CbgfOlU1ajpjnPuiQaiDm
    //quidditch : $2a$16$4o0WWtrq.ZefEmEbijNCGukCezqWTqz1VWlPm/xnaLM8d3WlS5pnK
    let brett = await users.addUser("bweiss@stevens.edu", "$2a$16$7JKSiEmoP3GNDSalogqgPu0sUbwder7CAN/5wnvCWe6xCKAKwlTD.", "Brett", "Weiss", "Pine Beach", "New Jersey", "USA");
    let john = await users.addUser("john@smith.com", "$2a$16$SsR2TGPD24nfBpyRlBzINeGU61AH0Yo/CbgfOlU1ajpjnPuiQaiDm", "John", "Smith", "NYC", "NY", "USA");
    let jane = await users.addUser("jane@doe.com", "$2a$16$4o0WWtrq.ZefEmEbijNCGukCezqWTqz1VWlPm/xnaLM8d3WlS5pnK", "Jane", "Doe", "Austin", "TX", "USA");
    let steve = await users.addUser("steve@wilkos.com", "$2a$16$7JKSiEmoP3GNDSalogqgPu0sUbwder7CAN/5wnvCWe6xCKAKwlTD.", "Steve", "Wilkos", "Madison", "WI", "USA");
    let justin = await users.addUser("justin@williams.com", "$2a$16$SsR2TGPD24nfBpyRlBzINeGU61AH0Yo/CbgfOlU1ajpjnPuiQaiDm", "Justin", "Williams", "Reno", "NV", "USA");
    let phil = await users.addUser("phil@rogers.com", "$2a$16$4o0WWtrq.ZefEmEbijNCGukCezqWTqz1VWlPm/xnaLM8d3WlS5pnK", "Phil", "Rogers", "Dover", "DE", "USA");
    let mike = await users.addUser("mike@jones.com", "$2a$16$7JKSiEmoP3GNDSalogqgPu0sUbwder7CAN/5wnvCWe6xCKAKwlTD.", "Mike", "Jones", "Denver", "CO", "USA");

    //beers
    let smonkey = await beers.addBeer(
        "Sour Monkey", 
        "Sour Brett Tripel", 
        9.5, 
        ["Pilsner"], 
        ["Tettnang"], 
        "Fruity notes from imported Belgian yeast swirl through a precise souring"
    );

    let gmonkey = await beers.addBeer(
        "Golden Monkey", 
        "Belgian-Style Tripel", 
        9.5, 
        ["Pilsner"], 
        ["Tettnang"], 
        "Nose is loaded with Belgian yeast character of banana and clove with an equally fruity body balanced with a light, earthy hop character. Savor notes of orange and spice followed by a dry finish."
    );

    let twmonkey = await beers.addBeer(
        "Twisted Monkey", 
        "Belgian-Style Blonde Ale with Mango", 
        5.8, 
        ["Pilsner"], 
        ["Tettnang"], 
        "Fruity Belgian yeast is enhanced with an exciting twist of Mango, resulting in a big flavor refreshment that only the Monkey can deliver."
    );

    let tmonkey = await beers.addBeer(
        "Tart Monkey", 
        "Session Sour Ale with Guava", 
        4.9, 
        ["Pilsner"], 
        ["Tettnang"], 
        "Guava, Wheat Added"
    );

    let easyringer = await beers.addBeer(
        "Easy Ringer", 
        "Lo-Cal IPA", 
        4.3, 
        ["2-Row Pale", "Carapils"], 
        ["Strata", "Citra", "Cascade"], 
        "Drinking crisp and light with little bitterness and tons of hop character, notes of passionfruit and citrus wow the crowd."
    );

    let classic = await beers.addBeer(
        "Classic", 
        "Easy Drinkin' Lager", 
        4.8, 
        ["Pilsner"], 
        ["Hallertau"], 
        "Perfectly balanced and exceptionally drinkable, this lager is expertly crafted with specialty hops, malt and yeast to be the standard of refreshment."
    );

    let nobrainer = await beers.addBeer(
        "No Brainer", 
        "IPA", 
        6.8, 
        ["Pilsner", "Carapils"], 
        ["Mandarina", "Citra", "Centennial", "Azacca"], 
        "A perfect formula makes for an easy choice as fruity and citrusy hops lead the way in this IPA. Our proprietary HopVic technology drives big hop flavor with notes of tangerine and mandarin orange."
    );

    let dirtwolf = await beers.addBeer(
        "Dirtwolf", 
        "Double IPA", 
        8.7, 
        ["Pilsner", "Pale Crystal"], 
        ["Citra", "Simcoe", "Mosaic", "Chinook"], 
        "This strong pack of American hops immerse in an aggressive dry-hopping to deliver intense aromas and flavors of citrusy, earthy notes."
    );

    let cloudwalker = await beers.addBeer(
        "Cloud Walker", 
        "Hazy Juicy IPA", 
        6.8, 
        ["2-Row Pale", "Wheat", "Flaked Oats", "Lactose"], 
        ["Citra", "Mosaic"], 
        "This dry-hopped hazy juicy IPA explodes as tropical and fruity elements float through cloudy formations to elevate hops to the highest pedestal."
    );

    let primapills = await beers.addBeer(
        "Prima Pills", 
        "German-style Pilsner", 
        5.3, 
        ["Pilsner"], 
        ["Tettnang", "Hallertau", "Spalt", "Saaz"], 
        "A crisp yet distinct Pilsner brewed with German hops that bring vivid notes of floral and spice with citrus and lemon. This is truly brilliant, bringing nuanced complexity together with smooth, easy drinking."
    );

    let hopdevil = await beers.addBeer(
        "Hopdevil", 
        "IPA", 
        6.7, 
        ["Pilsner", "Vienna", "Caramel"], 
        ["Cascade", "Centennial"], 
        "Pine and citrus filled nose from the American hops. Malt sweetness in there as well. Drinkable hop juiciness is the key while remaining balanced with ample caramel presence."
    );

    let hipczech = await beers.addBeer(
        "Hip Czech", 
        "Czech-style Lager", 
        4.8, 
        ["Pilsner"], 
        ["Saaz Saazer"], 
        "This crushable lager will knock you off your feet with Saaz hops and pilsner malts that face-off to boast subtle earthy hop notes balanced by a crisp and light body."
    );

    let tripelhorse = await beers.addBeer(
        "Tripel Horse", 
        "Belgian Style Tripel", 
        10.0, 
        ["Pilsen", "White Wheat", "Caramel"], 
        ["Chinook", "Hallertau", "Saaz"], 
        "Hints of vanilla and complex flavors"
    );

    let hippotizing = await beers.addBeer(
        "Hippotizing IPA", 
        "American IPA", 
        7.5, 
        ["Pilsen", "Vienna", "Carapils"], 
        ["Summit", "Chinook", "Mosaic", "Falconer's Flight"], 
        "Cross between West Coast and New England Styles. Amped up IPA for hop lovers."
    );

    let riverhorseIPA = await beers.addBeer(
        "IPA", 
        "India Pale Ale", 
        5.7, 
        ["Pilsen", "Carapils", "Melanoidin", "Honey"], 
        ["Summit", "Chinook", "Simcoe", "Citra", "Falconer's Flight", "Wakatu", "Cascade", "Centennial"], 
        "Hints of tropical fruit and citrus"
    );

    let clearskies = await beers.addBeer(
        "Clear Skies IPA", 
        "India Pale Ale", 
        5.8, 
        ["Pilsen", "Carapilsen"], 
        ["Falconer's Flight", "Simcoe", "Centennial"], 
        "Clean finish"
    );

    let fattire = await beers.addBeer(
        "Fat Tire", 
        "Amber Ale", 
        5.2, 
        ["Pale", "C-80", "Munich", "Victory"], 
        ["Willamette", "Goldings", "Nugget"],
        "Carbonation and light sweetness finish clean on your palate. Medium body."
    );

    let voodoo = await beers.addBeer(
        "Voodoo Ranger", 
        "India Pale Ale", 
        7.0, 
        ["Pale", "Black"], 
        ["Nugget", "Cascade", "Simcoe", "Chinook", "Mosaic", "Amarillo"],
        "Lightly sweet at first with a stronger, building and perfect bitterness. Coating and warming with a clean finish. Medium body."
    );

    let mountain = await beers.addBeer(
        "Mountain Time", 
        "Lager", 
        4.4, 
        ["Pale", "Black"], 
        ["Nugget", "Cascade", "Willamette"],
        "Light-bodied and refreshing with a slight sweetness. Light body, smooth and slightly coating, slight effervescence."
    );

    let trippel = await beers.addBeer(
        "Mountain Time", 
        "Belgian Style Ale", 
        8.5, 
        ["Pale", "Munich", "Pilsner"], 
        ["Target", "Hallertau Mittelfruh", "Saaz", "Liberty"],
        "Malty sweet, with clean firm hop bitter balance. Smooth start, crisp and warming finish. Medium body."
    );

    //comments
    await beers.addComment(smonkey._id.toString(), brett._id.toString(), "My favorite beer");
    await beers.addComment(smonkey._id.toString(), john._id.toString(), "Too sour for me");
    await beers.addComment(gmonkey._id.toString(), jane._id.toString(), "Very rich in flavor");
    await beers.addComment(gmonkey._id.toString(), steve._id.toString(), "Wonderful");
    await beers.addComment(gmonkey._id.toString(), justin._id.toString(), "Disgusting");
    await beers.addComment(tmonkey._id.toString(), phil._id.toString(), "Not a fan");
    await beers.addComment(easyringer._id.toString(), mike._id.toString(), "Easy to put back");
    await beers.addComment(easyringer._id.toString(), brett._id.toString(), "Good lawn mowing beer");
    await beers.addComment(classic._id.toString(), john._id.toString(), "Plain old beer");
    await beers.addComment(classic._id.toString(), jane._id.toString(), "Bland");
    await beers.addComment(nobrainer._id.toString(), steve._id.toString(), "Very tasty");
    await beers.addComment(nobrainer._id.toString(), justin._id.toString(), "Very strong hop presence");
    await beers.addComment(dirtwolf._id.toString(), phil._id.toString(), "Had to choke it down");
    await beers.addComment(dirtwolf._id.toString(), mike._id.toString(), "Unique");
    await beers.addComment(dirtwolf._id.toString(), brett._id.toString(), "A good changeup");
    await beers.addComment(cloudwalker._id.toString(), john._id.toString(), "Strong taste, can only have 1 or 2");
    await beers.addComment(primapills._id.toString(), jane._id.toString(), "Strong pilsner presence");
    await beers.addComment(primapills._id.toString(), steve._id.toString(), "Delicious");
    await beers.addComment(hopdevil._id.toString(), justin._id.toString(), "Refreshing");
    await beers.addComment(hopdevil._id.toString(), phil._id.toString(), "Too strong of a taste");
    await beers.addComment(tripelhorse._id.toString(), mike._id.toString(), "Love this beer!");
    await beers.addComment(tripelhorse._id.toString(), brett._id.toString(), "10% ABV gets you goin");
    await beers.addComment(hipczech._id.toString(), john._id.toString(), "Finally, a czech beer!");
    await beers.addComment(hipczech._id.toString(), jane._id.toString(), "Not for me");
    await beers.addComment(hippotizing._id.toString(), steve._id.toString(), "Cute hippo on the logo");
    await beers.addComment(hippotizing._id.toString(), justin._id.toString(), "Very good");
    await beers.addComment(riverhorseIPA._id.toString(), phil._id.toString(), "One of my favorites!");
    await beers.addComment(riverhorseIPA._id.toString(), mike._id.toString(), "Perfect");
    await beers.addComment(clearskies._id.toString(), brett._id.toString(), "Very bitter");
    await beers.addComment(clearskies._id.toString(), john._id.toString(), "Love this beer");
    await beers.addComment(fattire._id.toString(), jane._id.toString(), "Tasty");
    await beers.addComment(fattire._id.toString(), steve._id.toString(), "Good classic Amber Ale");
    await beers.addComment(voodoo._id.toString(), justin._id.toString(), "Sharp hop taste");
    await beers.addComment(voodoo._id.toString(), phil._id.toString(), "Gross");
    await beers.addComment(mountain._id.toString(), mike._id.toString(), "Simple and good for everyone");
    await beers.addComment(mountain._id.toString(), brett._id.toString(), "Tasty and refreshing");
    await beers.addComment(trippel._id.toString(), john._id.toString(), "Pretty good");
    await beers.addComment(trippel._id.toString(), jane._id.toString(), "My favorite beer");

    //reviews
    await reviews.addReview(brett._id.toString(), smonkey._id.toString(), 5, "This is the best beer out there. The sour taste is for sure an aquired taste, but I find it delicious and strong enough to just sip.");
    await reviews.addReview(brett._id.toString(), gmonkey._id.toString(), 2.5, "I don't really like this too much. Too bitter.");
    await reviews.addReview(brett._id.toString(), tmonkey._id.toString(), 4, "tart and light");
    await reviews.addReview(brett._id.toString(), twmonkey._id.toString(), 2, "Not a fan");
    await reviews.addReview(john._id.toString(), easyringer._id.toString(), 4.5, "Easy to drink, really good for the summer");
    await reviews.addReview(john._id.toString(), classic._id.toString(), 4, "A real classic beer as the name says. Belongs in a black can with white letters that read 'BEER'");
    await reviews.addReview(john._id.toString(), smonkey._id.toString(), 1, "This is disgusting. Sour is not for me, it hurts to drink.");
    await reviews.addReview(john._id.toString(), nobrainer._id.toString(), 4.9, "A really good beer if you like a classic hoppy taste.");
    await reviews.addReview(jane._id.toString(), smonkey._id.toString(), 3.9, "Not bad. I like how strong it is. Definitely can only have it once in a while.");
    await reviews.addReview(jane._id.toString(), easyringer._id.toString(), 4.2, "You can pound these at a summer BBQ.");
    await reviews.addReview(jane._id.toString(), cloudwalker._id.toString(), 2, "Bitter and hard to drink. Not for me.");
    await reviews.addReview(jane._id.toString(), hopdevil._id.toString(), 1, "Pretty gross to me. I guess I don't really like a hoppy taste.");
    await reviews.addReview(steve._id.toString(), classic._id.toString(), 3, "I could take it or leave it. Nothing special.");
    await reviews.addReview(steve._id.toString(), dirtwolf._id.toString(), 4, "What a unique taste, I really enjoyed it! However, I do not think I could have more than 2 of these in one sitting. It wrecks your pallete.");
    await reviews.addReview(steve._id.toString(), primapills._id.toString(), 4.4, "A sharp taste that really gets your tastbuds going without being overwhelming.");
    await reviews.addReview(steve._id.toString(), hopdevil._id.toString(), 5, "The name doesn't lie, you have to be a hop lover like me to love this beer!");
    await reviews.addReview(justin._id.toString(), tripelhorse._id.toString(), 4.5, "You can taste the unique blend of spices in this beer. I really enjoy it. But be careful, 10% ABV sneaks up on you!");
    await reviews.addReview(justin._id.toString(), hipczech._id.toString(), 2.5, "Tastes strange to me. Not really a fan but I don't mind having a few of them.");
    await reviews.addReview(justin._id.toString(), hippotizing._id.toString(), 3.8, "Very unique taste. I enjoyed it but I don't see it as a staple beverage for me.");
    await reviews.addReview(justin._id.toString(), riverhorseIPA._id.toString(), 4.8, "This is my favorite IPA. Something about it hits just right!");
    await reviews.addReview(phil._id.toString(), tripelhorse._id.toString(), 5, "This one knocks it out of the park. Such a tasty blend of spices in a Belgian Style Tripel. Strong so you only need 2 or 3.");
    await reviews.addReview(phil._id.toString(), mountain._id.toString(), 2, "Pretty bland and light. Tastes watered down in a way.");
    await reviews.addReview(phil._id.toString(), trippel._id.toString(), 5, "I don't have a hard time understanding why this is an award winning beer!");
    await reviews.addReview(phil._id.toString(), riverhorseIPA._id.toString(), 1.5, "Too bitter for me.");
    await reviews.addReview(mike._id.toString(), clearskies._id.toString(), 1, "I did not really enjoy this beer. Not going to drink it again.");
    await reviews.addReview(mike._id.toString(), dirtwolf._id.toString(), 2, "Too much going on in this beer.");
    await reviews.addReview(mike._id.toString(), voodoo._id.toString(), 4.5, "I really like this classic IPA. Definitely looking for more like it.");
    await reviews.addReview(mike._id.toString(), fattire._id.toString(), 5, "This beer belongs in a museum. I love it! Really enjoyable.");

    await users.updateUser(
        brett._id.toString(),
        {
            favoriteBeers: [smonkey._id.toString(), tmonkey._id.toString()],
            following: [justin._id.toString(), mike._id.toString()]
        }
    );

    await users.updateUser(
        john._id.toString(),
        {
            favoriteBeers: [nobrainer._id.toString(), easyringer._id.toString(), classic._id.toString()],
            following: [steve._id.toString(), brett._id.toString()]
        }
    );

    await users.updateUser(
        jane._id.toString(),
        {
            favoriteBeers: [smonkey._id.toString(), easyringer._id.toString()],
            following: [john._id.toString(), steve._id.toString()]
        }
    );

    await users.updateUser(
        steve._id.toString(),
        {
            favoriteBeers: [hopdevil._id.toString()],
            following: [john._id.toString(), jane._id.toString()]
        }
    );

    await users.updateUser(
        justin._id.toString(),
        {
            favoriteBeers: [tripelhorse._id.toString(), riverhorseIPA._id.toString()],
            following: [phil._id.toString(), mike._id.toString()]
        }
    );

    await users.updateUser(
        phil._id.toString(),
        {
            favoriteBeers: [tripelhorse._id.toString(), trippel._id.toString()],
            following: [steve._id.toString(), jane._id.toString(), john._id.toString()]
        }
    );

    await users.updateUser(
        mike._id.toString(),
        {
            favoriteBeers: [voodoo._id.toString(), fattire._id.toString()],
            following: [justin._id.toString(), brett._id.toString()]
        }
    );

	console.log('Done seeding database');
	await db.serverConfig.close();
};

main().catch(console.log);