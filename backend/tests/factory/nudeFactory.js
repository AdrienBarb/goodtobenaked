const { Factory } = require('rosie');
const { faker } = require('@faker-js/faker');

const mongoose = require('mongoose');
const nudeModel = require('../../models/nudeModel');

const NudeFactory = new Factory()
  .attr('user', () => new mongoose.Types.ObjectId())
  .attr('description', () => faker.datatype.string())
  .attr('priceDetails.fiatPrice', 3000)
  .attr('priceDetails.creditPrice', 3000)
  .attr('isFree', true)
  .attr('medias', [() => new mongoose.Types.ObjectId()])
  .attr('visibility', 'public')
  .attr('isArchived', false)
  .attr('paidMembers', [])
  .attr('tags', []);

const createNude = async ({
  user,
  visibility = 'public',
  medias,
  isFree = true,
  paidMembers = [],
  isArchived = false,
  tags = [],
}) => {
  const nudeData = NudeFactory.build({
    user,
    visibility,
    medias,
    isFree,
    paidMembers,
    isArchived,
    tags,
  });
  const nude = new nudeModel(nudeData);
  return nude.save();
};

module.exports = createNude;
