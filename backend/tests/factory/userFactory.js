const { faker } = require('@faker-js/faker');
const { Factory } = require('rosie');
const userModel = require('../../models/userModel');

const UserFactory = new Factory()
  .attr('pseudo', faker.internet.userName)
  .attr('email', faker.internet.email)
  .attr('password', faker.internet.password)
  .attr('userType', 'creator')
  .attr('bankAccount.name', 'Adrien Barbier')
  .attr('bankAccount.iban', 'FR1234567890')
  .attr('creditAmount', 10000);

const createUser = async ({ creditAmount = 10000, userType = 'creator' }) => {
  const userData = UserFactory.build({ creditAmount, userType });
  const user = new userModel(userData);
  return user.save();
};

module.exports = createUser;
