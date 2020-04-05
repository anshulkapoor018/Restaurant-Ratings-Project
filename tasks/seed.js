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

    console.log('Done seeding database for Restaurant Collection!');
	await db.serverConfig.close();
};

main().catch(error => {
    console.log(error);
});