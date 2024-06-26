const errorMessages = {
  CREDENTIALS: 'credentials',
  NOT_AUTHORIZED: 'not_authorized',
  MISSING_FIELDS: 'missing_fields',
  USER_ALREADY_EXIST: 'user_already_exist',
  PSEUDO_ALREADY_EXIST: 'pseudo_already_exist',
  NOT_FOUND: 'not_found',
  SOMETHING_HAPPENED: 'something_happened',
  INVALID_LINK: 'invalid_link',
  INVALID_FILE: 'invalid_file',
  INVALID_CODE: 'invalid_code',
  YOURE_BLOCKED: 'youre_blocked',
  NOT_ENOUGH_CREDIT: 'not_enough_credit',
};

const NOTIFICATIONS_TYPE = ['profile_viewed'];

module.exports = {
  errorMessages,
  NOTIFICATIONS_TYPE,
};
