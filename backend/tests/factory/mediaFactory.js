const { Factory } = require('rosie');
const { faker } = require('@faker-js/faker');
const mediaModel = require('../../models/mediaModel');
const mongoose = require('mongoose');

const MediaFactory = new Factory()
  .attr('user', () => new mongoose.Types.ObjectId())
  .attr('mediaType', () => faker.helpers.arrayElement(['video', 'image']))
  .attr('mediaPublicId', () => faker.datatype.uuid())
  .attr('fileName', () => faker.system.fileName())
  .attr('originalKey', () => faker.datatype.uuid())
  .attr('convertedKey', () => faker.datatype.uuid())
  .attr('blurredKey', () => faker.datatype.uuid())
  .attr('posterKey', () => faker.datatype.uuid())
  .attr('durationInMs', () =>
    faker.datatype.number({ min: 1000, max: 100000 }).toString(),
  )
  .attr('status', 'created')
  .attr('isArchived', false);

const createMedia = async (user) => {
  const mediaData = MediaFactory.build({ user });
  const media = new mediaModel(mediaData);
  return media.save();
};

module.exports = createMedia;
