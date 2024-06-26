const mongoose = require('mongoose');
const rosie = require('rosie');
const { faker } = require('@faker-js/faker');

const Factory = rosie.Factory;
const Creator = require('../../models/creatorModel');
const { creatorNotifications } = require('../../lib/constants');
const shippingFeeModel = require('../../models/shippingFeeModel');
const addressModel = require('../../models/addressModel');

const getCreator = async ({
  referrer,
  verified = 'verified',
  emailVerified = true,
  subscribers = [],
}) => {
  const shipingFee = await shippingFeeModel.create({
    region: 'Europe',
    countries: ['FR'],
    fees: { small: 2, medium: 4, large: 8 },
  });

  const defaultAddress = await addressModel.create({
    name: faker.name.fullName(),
    street_no: '2',
    street1: faker.address.street(),
    city: faker.address.city(),
    state: faker.address.state(),
    zip: faker.address.zipCode(),
    country: 'FR',
    formattedAddress: faker.address.streetAddress(true),
    latitude: faker.address.latitude(),
    longitude: faker.address.longitude(),
    shippoId: faker.datatype.uuid(),
    email: faker.internet.email(),
    isHeadOffice: faker.datatype.boolean(),
  });

  const CreatorFactory = Factory.define('creator')
    .attr('firstname', faker.name.firstName)
    .attr('lastname', faker.name.lastName)
    .attr('pseudo', faker.internet.userName)
    .attr('email', faker.internet.email)
    .attr('password', faker.internet.password)
    .attr('gender', new mongoose.Types.ObjectId())
    .attr('profilPicture', faker.image.imageUrl)
    .attr('emailNotification', faker.datatype.boolean)
    .attr('description', faker.lorem.paragraph)
    .attr('twitterLink', faker.internet.url)
    .attr('instagramLink', faker.internet.url)
    .attr('mymLink', faker.internet.url)
    .attr('onlyfansLink', faker.internet.url)
    .attr('nationality', faker.address.country)
    .attr('referredBy', referrer)
    .attr(
      'breastSize',
      faker.helpers.arrayElement(['tiny', 'normal', 'big', 'huge']),
    )
    .attr(
      'buttSize',
      faker.helpers.arrayElement(['small', 'normal', 'big', 'huge']),
    )
    .attr(
      'bodyType',
      faker.helpers.arrayElement(['skinny', 'athletic', 'medium', 'curvy']),
    )
    .attr(
      'hairColor',
      faker.helpers.arrayElement(['black', 'blonde', 'brunette', 'redhead']),
    )
    .attr('age', faker.datatype.number({ min: 18, max: 70 }))
    .attr('verified', verified)
    .attr('emailVerified', emailVerified)
    .attr('tags', [])
    .attr('shippingFees', shipingFee)
    .attr('rate', faker.datatype.number({ min: 0, max: 5 }))
    .attr('rateCount', faker.datatype.number({ min: 0, max: 100 }))
    .attr('country', faker.address.countryCode)
    .attr('salesFee', 0.15)
    .attr('address', defaultAddress)
    .attr('bankAccountName', faker.finance.accountName)
    .attr('bankAccountIBAN', faker.finance.iban)
    .attr('automaticPayment', faker.datatype.boolean)
    .attr('invoices', [])
    .attr('shippingCarriers', ['manual'])
    .attr('anonymous', faker.datatype.boolean)
    .attr('smallPackageDeliveryCost', faker.datatype.number)
    .attr('mediumPackageDeliveryCost', faker.datatype.number)
    .attr('bigPackageDeliveryCost', faker.datatype.number)
    .attr('completionProfilNotification', faker.datatype.boolean)
    .attr('inappNotification', creatorNotifications)
    .attr('lastLogin', faker.date.past)
    .attr('highlighted', {
      status: false,
      level: faker.datatype.number({ min: 1, max: 5 }),
      expiration: null,
    })
    .attr('notificationSubscribers', subscribers);

  const creatorAttributes = CreatorFactory.build();

  creator = await Creator.create(creatorAttributes);

  return creator;
};

module.exports = getCreator;
