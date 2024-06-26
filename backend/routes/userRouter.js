const express = require('express');

const {
  register,
  login,
  resetPasswordRequest,
  resetPassword,
  getUser,
  profileVisit,
  getAllUsers,
  getAccountOwner,
  userProfile,
  addProfilPicture,
  addBannerPicture,
  refreshCreditAmount,
  notificationSubscribe,
  checkIfUserVerified,
  identityVerification,
  editEmail,
  editPassword,
  deleteUser,
  editBankDetails,
  editEmailNotification,
  editInappNotification,
  getReferrals,
  sendTips,
  editUserType,
  getVerificationStep,
} = require('../controllers/userController');

const multer = require('multer');
const { userProtect } = require('../middleware/authUserMiddleware');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.post('/', register);
router.get('/', getAllUsers);
router.post('/login', login);
router.post('/password-request', resetPasswordRequest);
router.post('/password-reset', resetPassword);
router.get('/owner', userProtect, getAccountOwner);
router.put('/owner', userProtect, userProfile);
router.put('/bank-details', userProtect, editBankDetails);
router.put('/email-notification', userProtect, editEmailNotification);
router.put('/inapp-notification', userProtect, editInappNotification);
router.post('/send-tips', userProtect, sendTips);
router.get('/refresh-credit', userProtect, refreshCreditAmount);
router.post('/profile-visit', userProtect, profileVisit);
router.post('/notification-subscribe', userProtect, notificationSubscribe);
router.get('/is-verified', userProtect, checkIfUserVerified);
router.get('/verification-step', userProtect, getVerificationStep);
router.put('/edit-email', userProtect, editEmail);
router.put('/user-type', userProtect, editUserType);
router.put('/edit-password', userProtect, editPassword);
router.put('/delete-account', userProtect, deleteUser);
router.get('/referrals', userProtect, getReferrals);

router.post(
  '/profil-picture',
  userProtect,
  upload.single('profilePicture'),
  addProfilPicture,
);
router.post(
  '/profil-banner',
  userProtect,
  upload.single('bannerPicture'),
  addBannerPicture,
);
router.get('/:userId', getUser);
router.post(
  '/identity-verification',
  userProtect,
  upload.fields([
    { name: 'frontIdentity', maxCount: 1 },
    { name: 'backIdentity', maxCount: 1 },
    { name: 'frontAndFaceIdentity', maxCount: 1 },
  ]),
  identityVerification,
);

module.exports = router;
