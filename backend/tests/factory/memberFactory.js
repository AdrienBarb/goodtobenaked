const mongoose = require('mongoose');
const rosie = require('rosie');
const { faker } = require('@faker-js/faker');

const Factory = rosie.Factory;
const addressModel = require('../../models/addressModel');
const { memberNotifications } = require('../../lib/constants');
const memberModel = require('../../models/memberModel');

const getMember = async ({ inappNotification = memberNotifications }) => {
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

  const MemberFactory = Factory.define('member')
    .attr('firstname', faker.name.firstName())
    .attr('lastname', faker.name.lastName())
    .attr('pseudo', faker.internet.userName())
    .attr('email', faker.internet.email())
    .attr('password', faker.internet.password())
    .attr('verified', faker.datatype.boolean())
    .attr('emailNotification', faker.datatype.boolean())
    .attr('address', defaultAddress)
    .attr('profilPicture', faker.image.avatar())
    .attr('description', faker.lorem.sentence())
    .attr('emailVerified', faker.datatype.boolean())
    .attr('inappNotification', inappNotification);

  const memberAttributes = MemberFactory.build();

  const member = await memberModel.create(memberAttributes);

  return member;
};

module.exports = getMember;
