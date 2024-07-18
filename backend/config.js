const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  dotenv.config({ path: path.resolve(process.cwd(), '.env.development') });
} else {
  const secretsPath = '/run/secrets/';
  const secrets = [
    'JWT_SECRET',
    'MONGODB_URI',
    'INTERNAL_CLIENT_URL',
    'CLIENT_URL',
    'MAIL_GUN_API_KEY',
    'MAIL_GUN_BASE_URL',
    'ADMIN_PRIVATE_KEY',
    'STRIPE_API_KEY',
    'NOTION_API_KEY',
    'CLOUDFRONT_URL',
    'SLACK_TOKEN',
    'MAILCHIMP_API_KEY',
    'S3_BUCKET_MEDIA',
    'S3_BUCKET_PROCESSED_MEDIA',
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'AWS_REGION',
    'STRIPE_PUBLISHABLE_KEY',
    'STRIPE_ENDPOINT_SECRET',
  ];

  secrets.forEach((secret) => {
    try {
      const secretValue = fs
        .readFileSync(path.join(secretsPath, secret), 'utf8')
        .trim();
      process.env[secret] = secretValue;
    } catch (err) {
      console.error(`Error loading secret ${secret}:`, err);
    }
  });
}

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  mongodbUri: process.env.MONGODB_URI,
  internalClientUrl: process.env.INTERNAL_CLIENT_URL,
  clientUrl: process.env.CLIENT_URL,
  mailGunApiKey: process.env.MAIL_GUN_API_KEY,
  mailGunBaseUrl: process.env.MAIL_GUN_BASE_URL,
  adminPrivateKey: process.env.ADMIN_PRIVATE_KEY,
  stripeApiKey: process.env.STRIPE_API_KEY,
  notionApiKey: process.env.NOTION_API_KEY,
  cloudfrontUrl: process.env.CLOUDFRONT_URL,
  slackToken: process.env.SLACK_TOKEN,
  mailchimpApiKey: process.env.MAILCHIMP_API_KEY,
  s3BucketMedia: process.env.S3_BUCKET_MEDIA,
  s3BucketProcessedMedia: process.env.S3_BUCKET_PROCESSED_MEDIA,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  awsRegion: process.env.AWS_REGION,
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  stripeEndpointSecret: process.env.STRIPE_ENDPOINT_SECRET,
};
