const connection = require('../config/mongoConnection');
const data = require('../data/');
const users = data.users;
const restaurants = data.restaurants;
const reviews = data.reviews
const comments = data.comments

// Restaurants Format
// {
//     "restaurant_id": "7b7997a2",
//     "name": "Papa Johns",
//     "website": "papajohns.com",
//     "category": "Pizza",
//     "address": "125 18th Street",
//     "city": "Jersey City",
//     "state": "NJ",
//     “zip”: “07310”,
//     “longitude”: 40.732628,
//     “latitude”: -74.037628,
//     “rating”: 5,
//     "hashedPassword": "$2a$08$XdvNkfdNIL8F8xsuIUeSbNOF",
//     "reviews": [
//       "0c7997a2-c3d2-4f8c-b27a-6a1d4b5s6310"
//     ]
//  }
const main = async () => {
    const db = await connection();
    await db.dropDatabase();

    const R1 = await restaurants.addRestaurant("Papa Johns", "papajohns.com", "Pizza", "125 18th Street", "Jersey City", "NJ", "07310", 40.732628, -74.037628, "123456789");
    const R2 = await restaurants.addRestaurant("Chef Of India", "chefofindia.com", "Indian", "324 Central Ave", "Jersey City", "NJ", "07307", 40.7459498, -74.0512955, "123456789");
    const R3 = await restaurants.addRestaurant("Vibez Juice & Vegan Cafe", "chefofindia.com", "Juice", "82 Hutton St", "Jersey City", "NJ", "07307", 40.7445109, -74.0514578, "123456789");
    const R4 = await restaurants.addRestaurant("El Gordo", "elgordoeats.com", "Peruvian", "291 Central Ave", "Jersey City", "NJ", "07310", 40.7450379, -74.0524309, "123456789");
    const R5 = await restaurants.addRestaurant("The Franklin", "thefranklinjc.com", "Italian", "159 New York Ave", "Jersey City", "NJ", "07310", 40.7417174, -74.0491971, "123456789");
    const R6 = await restaurants.addRestaurant("Dino & Harry's Steakhouse", "dinoandharrys.com", "Steak", "163 14th St", "Hoboken", "NJ", "07030", 40.7534212, -74.0299569, "123456789");
    const R7 = await restaurants.addRestaurant("La Isla", "laislarestaurant.com", "Cuban", "104 Washington St", "Hoboken", "NJ", "07310", 40.7228179, 74.1316417, "123456789");
    const R8 = await restaurants.addRestaurant("Ali baba Restaurant", "hobokenalibaba.com", "Middle Eastern", "912 Washington St Ste 1", "Hoboken", "NJ", "07310", 40.7477496, -74.0302254, "123456789");
    const R9 = await restaurants.addRestaurant("South Street Fish & Ramen Co.", "southstreet.co", "Japanese", "219 Washington St", "Hoboken", "NJ", "07310", 40.7393196, -74.032313, "123456789");
    const R10 = await restaurants.addRestaurant("GreekTown", " greektown-hoboken.com", "Greak", "86 Garden St", "Hoboken", "NJ", "07310", 40.7369868, -74.3132926, "123456789");

    console.log('Done seeding database for Restaurant Collection!');
	await db.serverConfig.close();
};

main().catch(error => {
    console.log(error);
});