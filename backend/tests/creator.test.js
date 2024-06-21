const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index");
const { MongoMemoryServer } = require('mongodb-memory-server');
const Product = require("../models/productModel");
const Creator = require("../models/creatorModel");
const Member = require("../models/memberModel");
const ShippingFee = require("../models/shippingFeeModel");
const CreatorToken = require("../models/creatorTokenModel");
const GenderCategory = require("../models/genderCategoryModel");
const generateToken = require("../lib/utils/jwt")

require("dotenv").config();

let mongoServer;

//Connecting to the database before each test.
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
});

//Closing database connection after each test.
afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
});

let verifiedCreator
let verifiedCreator_2
let genderCat


//Creating a product before each test.
beforeAll(async () => {
    verifiedCreator = await Creator.create({
        firstname: 'Creator',
        lastname: '1',
        pseudo: 'creator',
        email: 'creator@gmail.fr',
        password: 'jesaispas',
        verified: 'verified',
        emailVerified: true,
    });

    verifiedCreator_2 = await Creator.create({
        firstname: 'Creator',
        lastname: '1',
        pseudo: 'creator_2',
        email: 'creator_2@gmail.fr',
        password: 'jesaispas',
        verified: 'verified',
        emailVerified: true,
    });

    genderCat = await GenderCategory.create({
        name: 'male'
    })
});



describe("Register creator", () => {
    test("Can create a new creator", async () => {
        const res = await request(app)
        .post("/api/creators")
        .send({
            pseudo: "adrienBarb",
            email: "adrien-barbier@hotmail.fr",
            password: "jesaispas",
            isOfferValid: true
        })

        expect(res.body._id).toBeDefined();
        expect(res.body.verified).toEqual("unverified");
        expect(res.body.emailVerified).toEqual(false);
        expect(res.body.token).toBeDefined();
        expect(res.statusCode).toBe(201);
        
        const createdCreator = await Creator.findById(res.body._id)
        expect(createdCreator.salesFee).toEqual(0.1);
        expect(createdCreator.address).toBeUndefined();
        expect(createdCreator.shippingFees.length).toEqual(1)
    });

    test("Can't create a creator with same email'", async () => {
        const res = await request(app)
        .post("/api/creators")
        .send({
            pseudo: "adrienBarb",
            email: "creator@gmail.fr",
            password: "jesaispas",
        })

        expect(res.statusCode).toBe(400);
    });

    test("Can't create a creator with same pseudo'", async () => {
        const res = await request(app)
        .post("/api/creators")
        .send({
            pseudo: "creator",
            email: "creator_bis@gmail.fr",
            password: "jesaispas",
        })

        expect(res.statusCode).toBe(400);
    });
});

describe("Login creator", () => {
    test("Can login as a creator", async () => {
        const res = await request(app)
        .post("/api/creators/login")
        .send({
            email: "adrien-barbier@hotmail.fr",
            password: "jesaispas",
        })

        expect(res.body._id).toBeDefined();
        expect(res.body.verified).toBeDefined();
        expect(res.body.emailVerified).toBeDefined();
        expect(res.body.token).toBeDefined();
    });
});

describe("Get current creator", () => {
    test("Get current creator", async () => {
        const res = await request(app).get(`/api/creators/${verifiedCreator?._id}`);
    
        expect(res.statusCode).toBe(200);
        expect(res.body._id).toBeDefined();
        expect(res.body.email).toBeDefined();
    });
});

describe("Edit current creator", () => {
    
    test("Can't have two identical pseudo", async () => {
        const token = generateToken(verifiedCreator?._id)

        const res = await request(app)
        .post(`/api/creators/profil-details`)
        .auth(token, { type: 'bearer' })
        .send({
            pseudo: "creator_2",
        })
    
        expect(res.statusCode).toBe(400);
    });
    
    test("Can edit a creator", async () => {
        const token = generateToken(verifiedCreator?._id)

        const res = await request(app)
        .post(`/api/creators/profil-details`)
        .auth(token, { type: 'bearer' })
        .send({
            pseudo: "pseudo",
            description: "description",
            twitterLink: "twitterLink",
            instagramLink: "instagramLink",
            mymLink: "mymLink",
            onlyfansLink: "onlyfansLink",
            age: 10,
            gender: GenderCategory?._id,
            breastSize: "breastSize",
            buttSize: "buttSize",
            bodyType: "bodyType",
            hairColor: "hairColor",
            country: "country",
        })
    
        expect(res.statusCode).toBe(200);
        expect(res.body.pseudo).toEqual('pseudo')
        expect(res.body.description).toEqual('description')
        expect(res.body.twitterLink).toEqual('twitterLink')
        expect(res.body.instagramLink).toEqual('instagramLink')
        expect(res.body.mymLink).toEqual('mymLink')
        expect(res.body.onlyfansLink).toEqual('onlyfansLink')
        expect(res.body.age).toEqual(10)
        expect(res.body.gender).toEqual(GenderCategory?._id)
        expect(res.body.breastSize).toEqual('breastSize')
        expect(res.body.buttSize).toEqual('buttSize')
        expect(res.body.bodyType).toEqual('bodyType')
        expect(res.body.hairColor).toEqual('hairColor')
        expect(res.body.country).toEqual('country')
    });
});

describe("createCreatorAddress", () => {
    
    test("A creator can create his address", async () => {
        const token = generateToken(verifiedCreator?._id)

        const addressDetails = {
            name: 'ALLY CORPORATION',
            street_no: '7B',
            street1: 'Rue du Général de Négrier',
            city: 'Belfort',
            state: 'Teritoire de Belfort',
            zip: '90000',
            country: 'FR',
            latitude: 12,
            longitude: 10,
            formattedAddress: '7B Rue du Général de Négrier, 90000 Belfort, France'
        }

        const res = await request(app)
        .post(`/api/creators/addresses`)
        .auth(token, { type: 'bearer' })
        .send(addressDetails)
    
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toEqual(addressDetails.name)
        expect(res.body.street_no).toEqual(addressDetails.street_no)
        expect(res.body.street1).toEqual(addressDetails.street1)
        expect(res.body.city).toEqual(addressDetails.city)
        expect(res.body.state).toEqual(addressDetails.state)
        expect(res.body.zip).toEqual(addressDetails.zip)
        expect(res.body.country).toEqual(addressDetails.country)
        expect(res.body.latitude).toEqual(addressDetails.latitude)
        expect(res.body.longitude).toEqual(addressDetails.longitude)
        expect(res.body.formattedAddress).toEqual(addressDetails.formattedAddress)

        const fetchedCreator = await Creator.findById(verifiedCreator?._id).populate('address')
        expect(fetchedCreator.address.name).toEqual(addressDetails.name)
        expect(fetchedCreator.address.street_no).toEqual(addressDetails.street_no)
        expect(fetchedCreator.address.street1).toEqual(addressDetails.street1)
        expect(fetchedCreator.address.city).toEqual(addressDetails.city)
        expect(fetchedCreator.address.state).toEqual(addressDetails.state)
        expect(fetchedCreator.address.zip).toEqual(addressDetails.zip)
        expect(fetchedCreator.address.country).toEqual(addressDetails.country)
        expect(fetchedCreator.address.latitude).toEqual(addressDetails.latitude)
        expect(fetchedCreator.address.longitude).toEqual(addressDetails.longitude)
        expect(fetchedCreator.address.formattedAddress).toEqual(addressDetails.formattedAddress)

    });
    
    test("A creator can edit his address", async () => {
        const token = generateToken(verifiedCreator?._id)

        const addressDetails = {
            name: 'ALLY CORP',
            street_no: '8B',
            street1: 'Rue du Général de Belfort',
            city: 'Paris',
            state: 'Teritoire de Paris',
            zip: '75000',
            country: 'FR',
            latitude: 14,
            longitude: 16,
            formattedAddress: '8B Rue du Général de Belfort, 90000 Belfort, France'
        }

        const res = await request(app)
        .post(`/api/creators/addresses`)
        .auth(token, { type: 'bearer' })
        .send(addressDetails)
    
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toEqual(addressDetails.name)
        expect(res.body.street_no).toEqual(addressDetails.street_no)
        expect(res.body.street1).toEqual(addressDetails.street1)
        expect(res.body.city).toEqual(addressDetails.city)
        expect(res.body.state).toEqual(addressDetails.state)
        expect(res.body.zip).toEqual(addressDetails.zip)
        expect(res.body.country).toEqual(addressDetails.country)
        expect(res.body.latitude).toEqual(addressDetails.latitude)
        expect(res.body.longitude).toEqual(addressDetails.longitude)
        expect(res.body.formattedAddress).toEqual(addressDetails.formattedAddress)

        const fetchedCreator = await Creator.findById(verifiedCreator?._id).populate('address')
        expect(fetchedCreator.address.name).toEqual(addressDetails.name)
        expect(fetchedCreator.address.street_no).toEqual(addressDetails.street_no)
        expect(fetchedCreator.address.street1).toEqual(addressDetails.street1)
        expect(fetchedCreator.address.city).toEqual(addressDetails.city)
        expect(fetchedCreator.address.state).toEqual(addressDetails.state)
        expect(fetchedCreator.address.zip).toEqual(addressDetails.zip)
        expect(fetchedCreator.address.country).toEqual(addressDetails.country)
        expect(fetchedCreator.address.latitude).toEqual(addressDetails.latitude)
        expect(fetchedCreator.address.longitude).toEqual(addressDetails.longitude)
        expect(fetchedCreator.address.formattedAddress).toEqual(addressDetails.formattedAddress)
    });

    test("Can't create without name", async () => {
        const token = generateToken(verifiedCreator?._id)

        const addressDetails = {
            street_no: '8B',
            street1: 'Rue du Général de Belfort',
            city: 'Paris',
            state: 'Teritoire de Paris',
            zip: '75000',
            country: 'FR',
            latitude: 14,
            longitude: 16,
            formattedAddress: '8B Rue du Général de Belfort, 90000 Belfort, France'
        }

        const res = await request(app)
        .post(`/api/creators/addresses`)
        .auth(token, { type: 'bearer' })
        .send(addressDetails)
    
        expect(res.statusCode).toBe(400);
    });

    test("Can't create without street1", async () => {
        const token = generateToken(verifiedCreator?._id)

        const addressDetails = {
            name: 'ALLY CORP',
            street_no: '8B',
            city: 'Paris',
            state: 'Teritoire de Paris',
            zip: '75000',
            country: 'FR',
            latitude: 14,
            longitude: 16,
            formattedAddress: '8B Rue du Général de Belfort, 90000 Belfort, France'
        }

        const res = await request(app)
        .post(`/api/creators/addresses`)
        .auth(token, { type: 'bearer' })
        .send(addressDetails)
    
        expect(res.statusCode).toBe(400);
    });

    test("Can't create without city", async () => {
        const token = generateToken(verifiedCreator?._id)

        const addressDetails = {
            name: 'ALLY CORP',
            street_no: '8B',
            street1: 'Rue du Général de Belfort',
            state: 'Teritoire de Paris',
            zip: '75000',
            country: 'FR',
            latitude: 14,
            longitude: 16,
            formattedAddress: '8B Rue du Général de Belfort, 90000 Belfort, France'
        }

        const res = await request(app)
        .post(`/api/creators/addresses`)
        .auth(token, { type: 'bearer' })
        .send(addressDetails)
    
        expect(res.statusCode).toBe(400);
    });

    test("Can't create without zip", async () => {
        const token = generateToken(verifiedCreator?._id)

        const addressDetails = {
            name: 'ALLY CORP',
            street_no: '8B',
            street1: 'Rue du Général de Belfort',
            city: 'Paris',
            state: 'Teritoire de Paris',
            country: 'FR',
            latitude: 14,
            longitude: 16,
            formattedAddress: '8B Rue du Général de Belfort, 90000 Belfort, France'
        }

        const res = await request(app)
        .post(`/api/creators/addresses`)
        .auth(token, { type: 'bearer' })
        .send(addressDetails)
    
        expect(res.statusCode).toBe(400);
    });

    test("Can't create without country", async () => {
        const token = generateToken(verifiedCreator?._id)

        const addressDetails = {
            name: 'ALLY CORP',
            street_no: '8B',
            street1: 'Rue du Général de Belfort',
            city: 'Paris',
            state: 'Teritoire de Paris',
            zip: '75000',
            latitude: 14,
            longitude: 16,
            formattedAddress: '8B Rue du Général de Belfort, 90000 Belfort, France'
        }

        const res = await request(app)
        .post(`/api/creators/addresses`)
        .auth(token, { type: 'bearer' })
        .send(addressDetails)
    
        expect(res.statusCode).toBe(400);
    });

});

describe("createDeliveryZone", () => {
    
    test("Can create a delivery zone", async () => {
        const token = generateToken(verifiedCreator?._id)

        const deliveryZone = {
            region: 'France',
            countries: ['US'],
            small: 5,
            medium: 10,
            large: 15,
        }

        const res = await request(app)
        .post(`/api/creators/delivery-zone`)
        .auth(token, { type: 'bearer' })
        .send(deliveryZone)

        console.log('res.body ', res.body)

        expect(res.statusCode).toBe(200);
        expect(res.body._id).toBeDefined()
        expect(res.body.region).toEqual(deliveryZone.region)
        expect(res.body.countries[0]).toEqual(deliveryZone.countries[0])
        expect(res.body.fees.small).toEqual(deliveryZone.small)
        expect(res.body.fees.medium).toEqual(deliveryZone.medium)
        expect(res.body.fees.large).toEqual(deliveryZone.large)

        const fetchedCreator = await Creator.findById(verifiedCreator?._id).populate('shippingFees')

        expect(fetchedCreator.shippingFees.length).toEqual(1)
    });
    
    test("Can edit a delivery zone", async () => {
        const token = generateToken(verifiedCreator?._id)

        const shippingFee = await ShippingFee.create({
            region: 'France',
            countries: ['FR'],
            fees: {
                small: 5,
                medium: 10,
                large: 15
            }
        })

        const newDeliveryZone = {
            region: 'France + Belgique',
            countries: ['FR', 'BE'],
            small: 6,
            medium: 11,
            large: 16,
        }

        const res = await request(app)
        .put(`/api/creators/delivery-zone/${shippingFee?._id}`)
        .auth(token, { type: 'bearer' })
        .send(newDeliveryZone)

        expect(res.statusCode).toBe(200);
        expect(res.body._id).toBeDefined()
        expect(res.body.region).toEqual(newDeliveryZone.region)
        expect(res.body.countries[0]).toEqual(newDeliveryZone.countries[0])
        expect(res.body.fees.small).toEqual(newDeliveryZone.small)
        expect(res.body.fees.medium).toEqual(newDeliveryZone.medium)
        expect(res.body.fees.large).toEqual(newDeliveryZone.large)
    });
    
    test("Can delete a delivery zone", async () => {
        const token = generateToken(verifiedCreator?._id)

        const shippingFee = await ShippingFee.create({
            region: 'France',
            countries: ['FR'],
            fees: {
                small: 5,
                medium: 10,
                large: 15
            }
        })

        const res = await request(app)
        .delete(`/api/creators/delivery-zone/${shippingFee?._id}`)
        .auth(token, { type: 'bearer' })

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeDefined()

        const fetchedShippinFee = await ShippingFee.find({ _id: shippingFee?._id })

        expect(fetchedShippinFee.length).toEqual(0)
    });
    
    test("Can't create a delivery zone if already exist", async () => {

        const shippingFee = await ShippingFee.create({
            region: 'France',
            countries: ['FR'],
            fees: {
                small: 5,
                medium: 10,
                large: 15
            }
        })

        const creator = await Creator.create({
            firstname: 'Creator2',
            lastname: '1',
            pseudo: 'creator2',
            email: 'creator2@gmail.fr',
            password: 'jesaispas',
            verified: 'verified',
            emailVerified: true,
            shippingFees: [shippingFee]
        });

        const token = generateToken(creator?._id)

        const newDeliveryZone = {
            region: 'France + Belgique',
            countries: ['FR', 'BE'],
            small: 6,
            medium: 11,
            large: 16,
        }

        const res = await request(app)
        .post(`/api/creators/delivery-zone`)
        .auth(token, { type: 'bearer' })
        .send(newDeliveryZone)

        expect(res.statusCode).toBe(400);
    });
    
    test("Can't edit a delivery zone if already exist", async () => {

        const shippingFee = await ShippingFee.create({
            region: 'France',
            countries: ['FR'],
            fees: {
                small: 5,
                medium: 10,
                large: 15
            }
        })

        const shippingFee2 = await ShippingFee.create({
            region: 'France',
            countries: ['BE'],
            fees: {
                small: 5,
                medium: 10,
                large: 15
            }
        })

        const creator = await Creator.create({
            firstname: 'Creator2',
            lastname: '1',
            pseudo: 'creator3',
            email: 'creator3@gmail.fr',
            password: 'jesaispas',
            verified: 'verified',
            emailVerified: true,
            shippingFees: [shippingFee, shippingFee2]
        });

        const token = generateToken(creator?._id)

        const newDeliveryZone = {
            region: 'France + Belgique',
            countries: ['FR', 'BE'],
            small: 6,
            medium: 11,
            large: 16,
        }

        const res = await request(app)
        .put(`/api/creators/delivery-zone/${shippingFee2?._id}`)
        .auth(token, { type: 'bearer' })
        .send(newDeliveryZone)

        expect(res.statusCode).toBe(400);
    });

});

