const connection = require('../config/mongoConnection');
const data = require('../data/');
const users = data.users;
const restaurants = data.restaurants;
const reviews = data.reviews
const comments = data.comments

const main = async () => {
    const db = await connection();
    await db.dropDatabase();

    //Seed Sample Restaurants
    const R1 = await restaurants.addRestaurant("Papa Johns", "papajohns.com", "Pizza", "125 18th Street", "Jersey City", "NJ", "07310", 40.732628, -74.037628);
    const R2 = await restaurants.addRestaurant("Chef Of India", "chefofindia.com", "Indian", "324 Central Ave", "Jersey City", "NJ", "07307", 40.7459498, -74.0512955);
    const R3 = await restaurants.addRestaurant("Vibez Juice & Vegan Cafe", "chefofindia.com", "Juice", "82 Hutton St", "Jersey City", "NJ", "07307", 40.7445109, -74.0514578);
    const R4 = await restaurants.addRestaurant("El Gordo", "elgordoeats.com", "Peruvian", "291 Central Ave", "Jersey City", "NJ", "07310", 40.7450379, -74.0524309);
    const R5 = await restaurants.addRestaurant("The Franklin", "thefranklinjc.com", "Italian", "159 New York Ave", "Jersey City", "NJ", "07310", 40.7417174, -74.0491971);
    const R6 = await restaurants.addRestaurant("Dino & Harry's Steakhouse", "dinoandharrys.com", "Steak", "163 14th St", "Hoboken", "NJ", "07030", 40.7534212, -74.0299569);
    const R7 = await restaurants.addRestaurant("La Isla", "laislarestaurant.com", "Cuban", "104 Washington St", "Hoboken", "NJ", "07310", 40.7228179, -74.1316417, "");
    const R8 = await restaurants.addRestaurant("Ali Baba Restaurant", "hobokenalibaba.com", "Middle Eastern", "912 Washington St Ste 1", "Hoboken", "NJ", "07310", 40.7477496, -74.0302254);
    const R9 = await restaurants.addRestaurant("South Street Fish & Ramen Co.", "southstreet.co", "Japanese", "219 Washington St", "Hoboken", "NJ", "07310", 40.7393196, -74.032313);
    const R10 = await restaurants.addRestaurant("GreekTown", "greektown-hoboken.com", "Greek", "86 Garden St", "Hoboken", "NJ", "07310", 40.7369868, -74.3132926);
    
    const R11 = await restaurants.addRestaurant("Cucharamama", "http://places.singleplatform.com/cucharamama/menu?ref=google", "Latin", "233 Clinton St", "Hoboken", "NJ", "07030", 40.7406889, -74.0368137);
    const R12 = await restaurants.addRestaurant("Zacks", "zackshoboken.com", "Latin", "232 Willow Ave", "Hoboken", "NJ", "07030", 40.7405781, -74.0361511);
    const R13 = await restaurants.addRestaurant("The Cuban", "thecubannj.com", "Cuban", "333 Washington St", "Hoboken", "NJ", "07030", 40.741024, -74.0317947);
    const R14 = await restaurants.addRestaurant("Amandas", "amandasrestaurant.com", "American", "908 Washington St A", "Hoboken", "NJ", "07030", 40.7476503, -74.0303058);
    const R15 = await restaurants.addRestaurant("Augustinos", "www.google.com", "Italian", "1104 Washington St", "Hoboken", "NJ", "07030", 40.7502738, -74.029437);
    const R16 = await restaurants.addRestaurant("Barbès", "http://places.singleplatform.com/barbs-69/menu?ref=google", "French", "1300 Park Ave", "Hoboken", "NJ", "07030", 40.7529884, -74.0314436);
    const R17 = await restaurants.addRestaurant("Anthony Davids", "anthonydavids.com", "Italian", "953 Bloomfield St", "Hoboken", "NJ", "07030", 40.7485811, -74.0303674);
    const R18 = await restaurants.addRestaurant("Halifax", "halifaxhoboken.com", "American", "At W Hotel, 225 River St", "Hoboken", "NJ", "07030", 40.8132911, -74.1449544);
    const R19 = await restaurants.addRestaurant("Court Street", "courtstreet.com", "Continental", "61 Sixth St", "Hoboken", "NJ", "07030", 40.7431676, -74.0308204);
    const R20 = await restaurants.addRestaurant("Carpe Diem", "carpediemhoboken.com", "Irish", "333 Washington St", "Hoboken", "NJ", "07030", 40.8132911, -74.1449544);

    const R21 = await restaurants.addRestaurant("Elysian cafe", "elysiancafe.com", "French", "1001 Washington St", "Hoboken", "NJ", "07030", 40.7431672, -74.0373865);
    const R22 = await restaurants.addRestaurant("La Casa", "zhttp://places.singleplatform.com/la-casa-257/menu?ref=google", "Latin", "54 Newark St", "Hoboken", "NJ", "07030", 40.7369205, -74.0324397);
    const R23 = await restaurants.addRestaurant("Robongi Hoboken", "robonginj.com", "Japanese", "520 Washington St", "Hoboken", "NJ", "07030", 40.7429258, -74.0316348);
    const R24 = await restaurants.addRestaurant("Blue Eyes Restaurant", "blueeyesrestaurant.com", "American", "525 Sinatra Dr", "Hoboken", "NJ", "07030", 40.7415968, -74.0283558);
    const R25 = await restaurants.addRestaurant("Union Hall Hoboken", "unionhallhoboken.com", "American", "306 Sinatra Dr", "Hoboken", "NJ", "07030", 40.7396827, -74.0293775);
    const R26 = await restaurants.addRestaurant("Sushi Lounge", "https://eat.chownow.com/discover/restaurant/2717", "French", "200 Hudson St", "Hoboken", "NJ", "07030", 40.7386556, -74.0318276);
    const R27 = await restaurants.addRestaurant("Gogi Grill", "gogigrill.com", "Korean", "79 Hudson St", "Hoboken", "NJ", "07030", 40.7363549, -74.031882);
    const R28 = await restaurants.addRestaurant("Tony Boloney's Hoboken", "tonyboloneys.com", "Pizza", "263 1st St", "Hoboken", "NJ", "07030", 40.7379855, -74.0365272);
    const R29 = await restaurants.addRestaurant("Grimaldi's Pizzeria", "courtstreet.com", "Pizza", "411 Washington St", "Hoboken", "NJ", "07030", 40.7417167, -74.0316415);
    const R30 = await restaurants.addRestaurant("Karma Kafe", "https://direct.chownow.com/order/4287/locations/5566", "Indian", "505 Washington St", "Hoboken", "NJ", "07030", 40.742402, -74.0313777);

    //Seed Sample Users
    const U1 = await users.addUser("Anna", "Brown", "anna@gmail.com", "", "Jersey City", "NJ", "21", "$2a$16$55b4ftaRCsHZcJ2X3VAmL.X85wi/K3ydOMWRoyafn2ubiA38l4HnK");
    const U2 = await users.addUser("Anshul", "Kapoor", "anshul@gmail.com", "", "Jersey City", "NJ", "25", "$2y$16$44T/HRDYr7ZJr5NgxKZ0GO5VUWIO7eEzeh.SQauQqfsUhjLLm8XBq");
    const U3 = await users.addUser("Kamil", "Zambrowski", "kamil@gmail.com", "", "Jersey City", "NJ", "22", "$2y$16$hJSJuDrg9GRus/zD3mfg..OhlFSEM1VFeOi4cxJhxKhHHmpPZRnjW");
    const U4 = await users.addUser("Michael", "Lyons", "michael@gmail.com", "", "Jersey City", "NJ", "22", "$2y$16$yRArTdcisBcd6ED5FEWJuO/Z.LMWsUbHz52FotTzYtf86Kc4QKE6a");
    const U5 = await users.addUser("John", "Doe", "john@gmail.com", "", "Jersey City", "NJ", "22", "$2y$16$KIjnyLrJ02Kpp6Y6HLZ6C.BDZidhOY73JYc4utfKCJB48Ithhr1oK");
    const U6 = await users.addUser("Ava", "Tartaglia", "ava@gmail.com", "", "Hoboken", "NJ", "23", "$2y$16$ZvmyAhGKEXDIe1gDejC38.K7xWYnF2SzYhlr4GTuv6cNFmqbtH2k6");
    const U7 = await users.addUser("Dan", "Pelis", "dan@gmail.com", "", "Hoboken", "NJ", "24", "$2y$16$dm4xV.Gvptu2Xl3Kh/S/suk8OoUoKZXUkqKExk8WD3ZUZXxd4QeK.");
    const U8 = await users.addUser("Jessica", "Su", "jessica@gmail.com", "", "Hoboken", "NJ", "25", "$2y$16$nEHCMDVuRC52/1j2AXfsyu5zsh3btEm0a3uvq.35kpEYR/pnFfS2a");
    const U9 = await users.addUser("Miles", "Rosenberg", "miles@gmail.com", "", "Hoboken", "NJ", "28", "$2y$16$IlU5ezmEuCip.KMmemBi7ePqMtT9JKkzZXhH05ILe7tqeKZemFn.m");
    const U10 = await users.addUser("Joe", "Smith", "joe@gmail.com", "", "Hoboken", "NJ", "26", "$2y$16$E0t0gNTnCXbW.nvDjnQSZ.yUN0cjdv4sHIWHciyu45N4BEdamdBzu");

    //Seed Sample Reviews
    const review1ForR1 = await reviews.addReview(String(R1._id), String(U1._id), "Amazing Food! But can improve.", 4, "");
    const comment1ForReview1ForR1 = await comments.addComment(String(U10._id), String(review1ForR1._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview1ForR1 = await comments.addComment(String(U9._id), String(review1ForR1._id), "Yes, Yes, Yes!!");

    const review2ForR1 = await reviews.addReview(String(R1._id), String(U2._id), "Loved the Pizza!", 5, "");
    const comment1ForReview2ForR1 = await comments.addComment(String(U8._id), String(review2ForR1._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview2ForR1 = await comments.addComment(String(U7._id), String(review2ForR1._id), "Yes, Yes, Yes!!");
    
    const review1ForR2 = await reviews.addReview(String(R2._id), String(U3._id), "Amazing Food! But can improve.", 4, "");
    const comment1ForReview1ForR2 = await comments.addComment(String(U6._id), String(review1ForR2._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview1ForR2 = await comments.addComment(String(U5._id), String(review1ForR2._id), "Yes, Yes, Yes!!");

    const review2ForR2 = await reviews.addReview(String(R2._id), String(U4._id), "Loved the Curries!", 5, "");
    const comment1ForReview2ForR2 = await comments.addComment(String(U3._id), String(review2ForR2._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview2ForR2 = await comments.addComment(String(U2._id), String(review2ForR2._id), "Yes, Yes, Yes!!");
    
    const review1ForR3 = await reviews.addReview(String(R3._id), String(U5._id), "Amazing Food! But can improve.", 4, "");
    const comment1ForReview1ForR3 = await comments.addComment(String(U1._id), String(review1ForR3._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview1ForR3 = await comments.addComment(String(U2._id), String(review1ForR3._id), "Yes, Yes, Yes!!");

    const review2ForR3 = await reviews.addReview(String(R3._id), String(U6._id), "Loved the Curries!", 5, "");
    const comment1ForReview2ForR3 = await comments.addComment(String(U3._id), String(review2ForR3._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview2ForR3 = await comments.addComment(String(U4._id), String(review2ForR3._id), "Yes, Yes, Yes!!");

    const review1ForR4 = await reviews.addReview(String(R4._id), String(U7._id), "Amazing Food! But can improve.", 4, "");
    const comment1ForReview1ForR4 = await comments.addComment(String(U5._id), String(review1ForR4._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview1ForR4 = await comments.addComment(String(U6._id), String(review1ForR4._id), "Yes, Yes, Yes!!");

    const review2ForR4 = await reviews.addReview(String(R4._id), String(U8._id), "Loved the Curries!", 5, "");
    const comment1ForReview2ForR4 = await comments.addComment(String(U7._id), String(review2ForR4._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview2ForR4 = await comments.addComment(String(U9._id), String(review2ForR4._id), "Yes, Yes, Yes!!");
    
    const review1ForR5 = await reviews.addReview(String(R5._id), String(U8._id), "Amazing Food! But can improve.", 4, "");
    const comment1ForReview1ForR5 = await comments.addComment(String(U10._id), String(review1ForR5._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview1ForR5 = await comments.addComment(String(U1._id), String(review1ForR5._id), "Yes, Yes, Yes!!");

    const review2ForR5 = await reviews.addReview(String(R5._id), String(U10._id), "Loved the Curries!", 5, "");
    const comment1ForReview2ForR5 = await comments.addComment(String(U2._id), String(review2ForR5._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview2ForR5 = await comments.addComment(String(U3._id), String(review2ForR5._id), "Yes, Yes, Yes!!");

    const review1ForR6 = await reviews.addReview(String(R6._id), String(U1._id), "Amazing Food! But can improve.", 4, "");
    const comment1ForReview1ForR6 = await comments.addComment(String(U10._id), String(review1ForR6._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview1ForR6 = await comments.addComment(String(U9._id), String(review1ForR6._id), "Yes, Yes, Yes!!");

    const review2ForR6 = await reviews.addReview(String(R6._id), String(U2._id), "Loved the Pizza!", 5, "");
    const comment1ForReview2ForR6 = await comments.addComment(String(U8._id), String(review2ForR6._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview2ForR6 = await comments.addComment(String(U7._id), String(review2ForR6._id), "Yes, Yes, Yes!!");
    
    const review1ForR7 = await reviews.addReview(String(R7._id), String(U3._id), "Amazing Food! But can improve.", 4, "");
    const comment1ForReview1ForR7 = await comments.addComment(String(U6._id), String(review1ForR7._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview1ForR7 = await comments.addComment(String(U5._id), String(review1ForR7._id), "Yes, Yes, Yes!!");

    const review2ForR7 = await reviews.addReview(String(R7._id), String(U4._id), "Loved the Curries!", 5, "");
    const comment1ForReview2ForR7 = await comments.addComment(String(U3._id), String(review2ForR7._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview2ForR7 = await comments.addComment(String(U2._id), String(review2ForR7._id), "Yes, Yes, Yes!!");
    
    const review1ForR8 = await reviews.addReview(String(R8._id), String(U5._id), "Amazing Food! But can improve.", 4, "");
    const comment1ForReview1ForR8 = await comments.addComment(String(U1._id), String(review1ForR8._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview1ForR8 = await comments.addComment(String(U2._id), String(review1ForR8._id), "Yes, Yes, Yes!!");

    const review2ForR8 = await reviews.addReview(String(R8._id), String(U6._id), "Loved the Curries!", 5, "");
    const comment1ForReview2ForR8 = await comments.addComment(String(U3._id), String(review2ForR8._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview2ForR8 = await comments.addComment(String(U4._id), String(review2ForR8._id), "Yes, Yes, Yes!!");

    const review1ForR9 = await reviews.addReview(String(R9._id), String(U7._id), "Amazing Food! But can improve.", 4, "");
    const comment1ForReview1ForR9 = await comments.addComment(String(U5._id), String(review1ForR9._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview1ForR9 = await comments.addComment(String(U6._id), String(review1ForR9._id), "Yes, Yes, Yes!!");

    const review2ForR9 = await reviews.addReview(String(R9._id), String(U8._id), "Loved the Curries!", 5, "");
    const comment1ForReview2ForR9 = await comments.addComment(String(U7._id), String(review2ForR9._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview2ForR9 = await comments.addComment(String(U9._id), String(review2ForR9._id), "Yes, Yes, Yes!!");
    
    const review1ForR10 = await reviews.addReview(String(R10._id), String(U8._id), "Amazing Food! But can improve.", 4, "");
    const comment1ForReview1ForR10 = await comments.addComment(String(U10._id), String(review1ForR10._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview1ForR10 = await comments.addComment(String(U1._id), String(review1ForR10._id), "Yes, Yes, Yes!!");

    const review2ForR10 = await reviews.addReview(String(R10._id), String(U10._id), "Loved the Curries!", 5, "");
    const comment1ForReview2ForR10 = await comments.addComment(String(U2._id), String(review2ForR10._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview2ForR10 = await comments.addComment(String(U3._id), String(review2ForR10._id), "Yes, Yes, Yes!!");
    
    const review1ForR11 = await reviews.addReview(String(R11._id), String(U1._id), "Amazing Food! But can improve.", 4, "");
    const comment1ForReview1ForR11 = await comments.addComment(String(U10._id), String(review1ForR11._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview1ForR11 = await comments.addComment(String(U9._id), String(review1ForR11._id), "Yes, Yes, Yes!!");

    const review2ForR11 = await reviews.addReview(String(R11._id), String(U2._id), "Loved the Pizza!", 5, "");
    const comment1ForReview2ForR11 = await comments.addComment(String(U8._id), String(review2ForR11._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview2ForR11 = await comments.addComment(String(U7._id), String(review2ForR11._id), "Yes, Yes, Yes!!");
    
    const review1ForR12 = await reviews.addReview(String(R12._id), String(U3._id), "Amazing Food! But can improve.", 4, "");
    const comment1ForReview1ForR12 = await comments.addComment(String(U6._id), String(review1ForR12._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview1ForR12 = await comments.addComment(String(U5._id), String(review1ForR12._id), "Yes, Yes, Yes!!");

    const review2ForR12 = await reviews.addReview(String(R12._id), String(U4._id), "Loved the Curries!", 5, "");
    const comment1ForReview2ForR12 = await comments.addComment(String(U3._id), String(review2ForR12._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview2ForR12 = await comments.addComment(String(U2._id), String(review2ForR12._id), "Yes, Yes, Yes!!");
    
    const review1ForR13 = await reviews.addReview(String(R13._id), String(U5._id), "Amazing Food! But can improve.", 4, "");
    const comment1ForReview1ForR13 = await comments.addComment(String(U1._id), String(review1ForR13._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview1ForR13 = await comments.addComment(String(U2._id), String(review1ForR13._id), "Yes, Yes, Yes!!");

    const review2ForR13 = await reviews.addReview(String(R13._id), String(U6._id), "Loved the Curries!", 5, "");
    const comment1ForReview2ForR13 = await comments.addComment(String(U3._id), String(review2ForR13._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview2ForR13 = await comments.addComment(String(U4._id), String(review2ForR13._id), "Yes, Yes, Yes!!");

    const review1ForR14 = await reviews.addReview(String(R14._id), String(U7._id), "Amazing Food! But can improve.", 4, "");
    const comment1ForReview1ForR14 = await comments.addComment(String(U5._id), String(review1ForR14._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview1ForR14 = await comments.addComment(String(U6._id), String(review1ForR14._id), "Yes, Yes, Yes!!");

    const review2ForR14 = await reviews.addReview(String(R14._id), String(U8._id), "Loved the Curries!", 5, "");
    const comment1ForReview2ForR14 = await comments.addComment(String(U7._id), String(review2ForR14._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview2ForR14 = await comments.addComment(String(U9._id), String(review2ForR14._id), "Yes, Yes, Yes!!");
    
    const review1ForR15 = await reviews.addReview(String(R15._id), String(U8._id), "Amazing Food! But can improve.", 4, "");
    const comment1ForReview1ForR15 = await comments.addComment(String(U10._id), String(review1ForR15._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview1ForR15 = await comments.addComment(String(U1._id), String(review1ForR15._id), "Yes, Yes, Yes!!");

    const review2ForR15 = await reviews.addReview(String(R15._id), String(U10._id), "Loved the Curries!", 5, "");
    const comment1ForReview2ForR15 = await comments.addComment(String(U2._id), String(review2ForR15._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview2ForR15 = await comments.addComment(String(U3._id), String(review2ForR15._id), "Yes, Yes, Yes!!");

    const review1ForR16 = await reviews.addReview(String(R16._id), String(U1._id), "Amazing Food! But can improve.", 4, "");
    const comment1ForReview1ForR16 = await comments.addComment(String(U10._id), String(review1ForR16._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview1ForR16 = await comments.addComment(String(U9._id), String(review1ForR16._id), "Yes, Yes, Yes!!");

    const review2ForR16 = await reviews.addReview(String(R16._id), String(U2._id), "Loved the Pizza!", 5, "");
    const comment1ForReview2ForR16 = await comments.addComment(String(U8._id), String(review2ForR16._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview2ForR16 = await comments.addComment(String(U7._id), String(review2ForR16._id), "Yes, Yes, Yes!!");
    
    const review1ForR17 = await reviews.addReview(String(R17._id), String(U3._id), "Amazing Food! But can improve.", 4, "");
    const comment1ForReview1ForR17 = await comments.addComment(String(U6._id), String(review1ForR17._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview1ForR17 = await comments.addComment(String(U5._id), String(review1ForR17._id), "Yes, Yes, Yes!!");

    const review2ForR17 = await reviews.addReview(String(R17._id), String(U4._id), "Loved the Curries!", 5, "");
    const comment1ForReview2ForR17 = await comments.addComment(String(U3._id), String(review2ForR17._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview2ForR17 = await comments.addComment(String(U2._id), String(review2ForR17._id), "Yes, Yes, Yes!!");
    
    const review1ForR18 = await reviews.addReview(String(R18._id), String(U5._id), "Amazing Food! But can improve.", 4, "");
    const comment1ForReview1ForR18 = await comments.addComment(String(U1._id), String(review1ForR18._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview1ForR18 = await comments.addComment(String(U2._id), String(review1ForR18._id), "Yes, Yes, Yes!!");

    const review2ForR18 = await reviews.addReview(String(R18._id), String(U6._id), "Loved the Curries!", 5, "");
    const comment1ForReview2ForR18 = await comments.addComment(String(U3._id), String(review2ForR18._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview2ForR18 = await comments.addComment(String(U4._id), String(review2ForR18._id), "Yes, Yes, Yes!!");

    const review1ForR19 = await reviews.addReview(String(R19._id), String(U7._id), "Amazing Food! But can improve.", 4, "");
    const comment1ForReview1ForR19 = await comments.addComment(String(U5._id), String(review1ForR19._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview1ForR19 = await comments.addComment(String(U6._id), String(review1ForR19._id), "Yes, Yes, Yes!!");

    const review2ForR19 = await reviews.addReview(String(R19._id), String(U8._id), "Loved the Curries!", 5, "");
    const comment1ForReview2ForR19 = await comments.addComment(String(U7._id), String(review2ForR19._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview2ForR19 = await comments.addComment(String(U9._id), String(review2ForR19._id), "Yes, Yes, Yes!!");
    
    const review1ForR20 = await reviews.addReview(String(R20._id), String(U8._id), "Amazing Food! But can improve.", 4, "");
    const comment1ForReview1ForR20 = await comments.addComment(String(U10._id), String(review1ForR20._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview1ForR20 = await comments.addComment(String(U1._id), String(review1ForR20._id), "Yes, Yes, Yes!!");

    const review2ForR20 = await reviews.addReview(String(R20._id), String(U10._id), "Loved the Curries!", 5, "");
    const comment1ForReview2ForR20 = await comments.addComment(String(U2._id), String(review2ForR20._id), "Yes, they have Amazing Food! I went there last week");
    const comment2ForReview2ForR20 = await comments.addComment(String(U3._id), String(review2ForR20._id), "Yes, Yes, Yes!!");
    
    const review1ForR21 = await reviews.addReview(String(R21._id), String(U10._id), "The food tastes authentic and the staff is very pleasant. We have dined in and ordered online multiple times from this restaurant and never had any issues with the quality of the food or the delivery service. My favorite is the Maharaja thali served only on weekends.", 4, "");
    const review1ForR22 = await reviews.addReview(String(R22._id), String(U9._id), "This place has very good starters. Their gobi chilly has won a  special place in my heart. The variety of biryanis is just too good. The taste is even better. I have been taking all my friends there and they love it too. The service is polite and accurate.", 4, "");
    const review1ForR23 = await reviews.addReview(String(R23._id), String(U8._id), "This place has very good starters. Their gobi chilly has won a  special place in my heart. The variety of biryanis is just too good. The taste is even better. I have been taking all my friends there and they love it too. The service is polite and accurate.", 4, "");
    const review1ForR24 = await reviews.addReview(String(R24._id), String(U7._id), "Amazing Food! But can improve.", 4, "");
    const review1ForR25 = await reviews.addReview(String(R25._id), String(U6._id), "This place has very good starters. Their gobi chilly has won a  special place in my heart. The variety of biryanis is just too good. The taste is even better. I have been taking all my friends there and they love it too. The service is polite and accurate.", 4, "");
    const review1ForR26 = await reviews.addReview(String(R26._id), String(U5._id), "This place has very good starters. Their gobi chilly has won a  special place in my heart. The variety of biryanis is just too good. The taste is even better. I have been taking all my friends there and they love it too. The service is polite and accurate.", 4, "");
    const review1ForR27 = await reviews.addReview(String(R27._id), String(U4._id), "Really Bad Experience", 1, "");
    const review1ForR28 = await reviews.addReview(String(R28._id), String(U3._id), "Bad Experience! Wont try again", 1, "");
    const review1ForR29 = await reviews.addReview(String(R29._id), String(U2._id), "Slurpy!", 5, "");
    const review1ForR30 = await reviews.addReview(String(R30._id), String(U1._id), "Good prices", 3, "");

    console.log('Done seeding database for Restaurant Collection!');
	await db.serverConfig.close();
};

main().catch(error => {
    console.log(error);
});