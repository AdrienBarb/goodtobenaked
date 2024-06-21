const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index");
const { MongoMemoryServer } = require('mongodb-memory-server');
const Product = require("../models/productModel");
const Creator = require("../models/creatorModel");
const Member = require("../models/memberModel");
const Order = require("../models/orderModel");
const Address = require("../models/addressModel");
const ShippingFee = require("../models/shippingFeeModel");
const Comission = require("../models/comissionModel");
const Refund = require("../models/refundModel");
const generateToken = require("../lib/utils/jwt");
const refundModel = require("../models/refundModel");
const { writeComments } = require("../lib/order/writeComments");
const moment = require('moment');
const invoiceModel = require("../models/invoiceModel");
const { getPaidIncomes } = require("../lib/income/getPaidIncomes");
const { getUncompletedIncomes } = require("../lib/income/getUncompletedIncomes");
const { getUnPaidIncomes } = require("../lib/income/getUnPaidIncomes");
const { getUnpaidOrders } = require("../lib/income");
const { getUnpaidComissions } = require("../lib/income/getUnpaidComissions");
const { getInvoicesDetails } = require("../lib/income/getInvoicesDetails");

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

let creator
let member
let creatorToken
let memberToken
let address
let address2
let shippingFee

const getProduct = async (creator) => {
    return await Product.create({
        userId: creator,
        name: 'product1',
        price: 10,
        serviceFee: 1,
        serviceFeeVat: 0.2,
        totalPrice: 11.2,
        packageSize: 'small',
    })
}

//Creating a product before each test.
beforeAll(async () => {
    address = await Address.create({
        name: "Ally Corporation",
        street_no: "60",
        street1: "Rue François 1er",
        city: "Paris",
        zip: "75008",
        country: "FR",
        formattedAddress: "60 Rue François 1er, 75008 Paris, France",
        latitude: 48.8699758,
        longitude: 2.3020203,
        shippoId: "46dadb150c374026866c723f0c165e07",
    }) 

    address2 = await Address.create({
        name: "JL",
        street_no: "7B",
        street1: "Rue du Général de Négrier",
        city: "Belfort",
        zip: "90000",
        country: "FR",
        formattedAddress: "7B Rue du Général de Négrier, 90000 Belfort, France",
        latitude: 47.6318662,
        longitude: 6.859327599999999,
        shippoId: "8dfe83909f3846ada88b71ea9e5dba4d",
        email: "adrien-barbier@hotmail.fr",
    })

    creator = await Creator.create({
        pseudo: 'creator',
        email: 'creator@gmail.fr',
        password: 'jesaispas',
        verified: 'verified',
        emailVerified: true,
        bankAccountName: 'Adrien Barbier',
        bankAccountIBAN: 'FROO',
        address: address2
    });

    creatorToken = generateToken(creator?._id)

    member = await Member.create({
        pseudo: 'member',
        email: 'member@gmail.fr',
        password: 'jesaispas',
    });
    memberToken = generateToken(member?._id)

    shippingFee = await ShippingFee.create({
        region: 'France',
        countries: ['FR'],
        fees: {
            small: 5,
            medium: 10,
            large: 15
        }
    })
});


describe("createShippment", () => {

    test("Shouldn't show rates because no shipping carrier selected", async () => {
        const creator = await Creator.create({
            pseudo: 'creator1',
            email: 'creator1@gmail.fr',
            password: 'jesaispas',
            verified: 'verified',
            emailVerified: true,
            bankAccountName: 'Adrien Barbier',
            bankAccountIBAN: 'FROO',
            address: address2,
        });

        const product = await getProduct(creator)

        const member = await Member.create({
            pseudo: 'member1',
            email: 'member1@gmail.fr',
            password: 'jesaispas',
            address: address
        });

        const token = generateToken(member?._id)

        const res = await request(app)
        .post("/api/shipping/shippment")
        .auth(token, { type: 'bearer' })
        .send({
            productId: product,
            shippoId: member?.address?.shippoId
        })

        expect(res.statusCode).toBe(200);
        expect(res.body.rates.length).toEqual(0);
        expect(res.body.shippment).toEqual(null);
    });

    test("Shouldn't show manual rate, because no manual shipping fee", async () => {
        const creator = await Creator.create({
            pseudo: 'creator2',
            email: 'creator2@gmail.fr',
            password: 'jesaispas',
            verified: 'verified',
            emailVerified: true,
            bankAccountName: 'Adrien Barbier',
            bankAccountIBAN: 'FROO',
            address: address2,
            shippingCarriers: ["manual"]
        });

        const product = await getProduct(creator)

        const member = await Member.create({
            pseudo: 'member2',
            email: 'member2@gmail.fr',
            password: 'jesaispas',
            address: address
        });

        const token = generateToken(member?._id)

        const res = await request(app)
        .post("/api/shipping/shippment")
        .auth(token, { type: 'bearer' })
        .send({
            productId: product,
            shippoId: member?.address?.shippoId
        })

        expect(res.statusCode).toBe(200);
        expect(res.body.rates.length).toEqual(0);
        expect(res.body.shippment).toEqual(null);
    });

    test("Should show manual rate", async () => {
        const creator = await Creator.create({
            pseudo: 'creator3',
            email: 'creator3@gmail.fr',
            password: 'jesaispas',
            verified: 'verified',
            emailVerified: true,
            bankAccountName: 'Adrien Barbier',
            bankAccountIBAN: 'FROO',
            address: address2,
            shippingFees: [shippingFee],
            shippingCarriers: ["manual"]
        });

        const product = await getProduct(creator)

        const member = await Member.create({
            pseudo: 'member3',
            email: 'member3@gmail.fr',
            password: 'jesaispas',
            address: address
        });

        const token = generateToken(member?._id)

        const res = await request(app)
        .post("/api/shipping/shippment")
        .auth(token, { type: 'bearer' })
        .send({
            productId: product,
            shippoId: member?.address?.shippoId
        })

        const manualFee = res.body.rates.find((r) => r.servicelevel.token === 'manual')

        expect(res.statusCode).toBe(200);
        expect(manualFee.amount).toBe(5);
        expect(res.body.rates.length).toEqual(1);
        expect(res.body.shippment).toEqual(null);
    });

    test("Should show all rates", async () => {
        const creator = await Creator.create({
            pseudo: 'creator4',
            email: 'creator4@gmail.fr',
            password: 'jesaispas',
            verified: 'verified',
            emailVerified: true,
            bankAccountName: 'Adrien Barbier',
            bankAccountIBAN: 'FROO',
            address: address2,
            shippingFees: [shippingFee],
            shippingCarriers: ["manual", 'mondial_relay_pointrelais', 'colissimo_home']
        });

        const product = await getProduct(creator)

        const member = await Member.create({
            pseudo: 'member4',
            email: 'member4@gmail.fr',
            password: 'jesaispas',
            address: address
        });

        const token = generateToken(member?._id)

        const res = await request(app)
        .post("/api/shipping/shippment")
        .auth(token, { type: 'bearer' })
        .send({
            productId: product,
            shippoId: member?.address?.shippoId
        })

        const manualFee = res.body.rates.find((r) => r.servicelevel.token === 'manual')

        expect(res.statusCode).toBe(200);
        expect(manualFee.amount).toBe(5);
        expect(res.body.rates.length).toEqual(3);
        expect(res.body.shippment).toBeDefined();
        expect(res.body.shippment?.address_from?.object_id).toBeDefined();
        expect(res.body.shippment?.parcels?.[0]?.object_id).toBeDefined();
    });
});

describe("getRelayPoints", () => {

    test("Should return all relay points", async () => {

        const member = await Member.create({
            pseudo: 'member5',
            email: 'member5@gmail.fr',
            password: 'jesaispas',
            address: address
        });

        const token = generateToken(member?._id)

        const res = await request(app)
        .get("/api/shipping/relay-points")
        .auth(token, { type: 'bearer' })
        .query({
            zip: '90000',
            city: 'Pont-de-Roide'
        })

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

});

describe("createRelayShippment", () => {

    test("Should return a shippment", async () => {
        const creator = await Creator.create({
            pseudo: 'creator5',
            email: 'creator5@gmail.fr',
            password: 'jesaispas',
            verified: 'verified',
            emailVerified: true,
            bankAccountName: 'Adrien Barbier',
            bankAccountIBAN: 'FROO',
            address: address2,
            shippingFees: [shippingFee],
            shippingCarriers: ["manual", 'mondial_relay_pointrelais', 'colissimo_home']
        });

        const product = await getProduct(creator)

        const member = await Member.create({
            pseudo: 'member6',
            email: 'member6@gmail.fr',
            password: 'jesaispas',
            address: address
        });

        const token = generateToken(member?._id)

        const res = await request(app)
        .post("/api/shipping/shippment")
        .auth(token, { type: 'bearer' })
        .send({
            productId: product,
            shippoId: member?.address?.shippoId
        })

        const addressFromId = res.body.shippment?.address_from?.object_id
        const parcelId = res.body.shippment?.parcels?.[0]?.object_id

        const relayResponse = await request(app)
        .get("/api/shipping/relay-points")
        .auth(token, { type: 'bearer' })
        .query({
            zip: member?.address?.zip,
            city: member?.address?.city
        })

        const addressTo = {
            name: member.address.name,
            email: member?.email,
            company: relayResponse.body[0].LgAdr1,
            street1: relayResponse.body[0].LgAdr3,
            city: relayResponse.body[0].Ville,
            zip: relayResponse.body[0].CP,
            country: relayResponse.body[0].Pays,
            mondialRelayId: relayResponse.body[0].Num
        }

        const relayShippentResponse = await request(app)
        .post("/api/shipping/relay-shippment")
        .auth(token, { type: 'bearer' })
        .send({
            addressFromId: addressFromId,
            parcelId: parcelId,
            addressTo: addressTo
        })

        expect(relayShippentResponse.statusCode).toBe(200);
        expect(relayShippentResponse.body).toBeDefined;
        expect(relayShippentResponse.body.rates.length).toBeGreaterThan(0);
        expect(relayShippentResponse.body.address_to).toBeDefined();
    }, 10000);
});


