const { faker } = require('@faker-js/faker');
const { Factory } = require('rosie');
const userModel = require('../../models/userModel');
const moment = require('moment');

const UserFactory = new Factory()
  .attr('pseudo', faker.internet.userName)
  .attr('email', faker.internet.email)
  .attr('password', faker.internet.password)
  .attr('userType', 'creator')
  .attr('isAccountVerified', true)
  .attr('bankAccount.name', 'Adrien Barbier')
  .attr('bankAccount.iban', 'FR1234567890')
  .attr('creditAmount', 10000)
  .attr('notificationSubscribers', [])
  .attr('profileViewers', [])
  .attr('messageSenders', [])
  .attr('nudeBuyers', [])
  .attr(
    'promotionEndDate',
    moment.utc().add(3, 'months').startOf('day').toDate(),
  );

const createUser = async ({
  creditAmount = 10000,
  userType = 'creator',
  promotionEndDate = moment.utc().add(3, 'months').startOf('day').toDate(),
  notificationSubscribers = [],
  profileViewers = [],
  messageSenders = [],
  nudeBuyers = [],
  isAccountVerified = true,
}) => {
  const userData = UserFactory.build({
    creditAmount,
    userType,
    promotionEndDate,
    notificationSubscribers,
    profileViewers,
    messageSenders,
    nudeBuyers,
    isAccountVerified,
  });
  const user = new userModel(userData);
  return user.save();
};

module.exports = createUser;
