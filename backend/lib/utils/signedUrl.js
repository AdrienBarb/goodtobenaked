const { getSignedUrl } = require('@aws-sdk/cloudfront-signer');
const fs = require('fs');
require('dotenv').config();

module.exports = signUrl = (urlToSign) => {
  if (process.env.NODE_ENV === 'test') {
    return 'www.image.com';
  }

  const privateKeyPath = process.env.PRIVATE_KEY_PATH;
  const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
  const keyPairId = process.env.KEY_PAIR_ID;

  const signedUrl = getSignedUrl({
    url: urlToSign,
    dateLessThan: new Date(Date.now() + 3600000).toISOString(),
    keyPairId,
    privateKey,
  });

  return signedUrl;
};
