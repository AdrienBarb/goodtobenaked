// serviceOrderFactory.js
const mongoose = require('mongoose');
const rosie = require('rosie');
const { faker } = require('@faker-js/faker');
const mediaModel = require('../../models/mediaModel');

const getMedia = async (creator) => {
  const newMedia = new mediaModel({
    creator: creator,
    description: faker.lorem.paragraph(),
    mediaType: 'image',
    imageHeight: 400,
    s3Key: {
      original: '1',
      preview: '2',
    },
  });

  return newMedia.save();
};

module.exports = getMedia;
