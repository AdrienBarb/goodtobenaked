const { getSignedUrl } = require('@aws-sdk/cloudfront-signer');
const fs = require('fs');
require('dotenv').config();

const privateKeyPath = process.env.PRIVATE_KEY_PATH;
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
const keyPairId = process.env.KEY_PAIR_ID;

module.exports = signUrl = (urlToSign) => {
  const signedUrl = getSignedUrl({
    url: urlToSign,
    dateLessThan: new Date(Date.now() + 3600000).toISOString(),
    keyPairId,
    privateKey,
  });

  return signedUrl;
};
