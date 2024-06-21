const express = require("express");

const {
  memberForgot,
  resetMemberPassword,
  creatorForgot,
  resetCreatorPassword,
} = require("../controllers/passwordController");

const router = express.Router();

router.post("/member-password", memberForgot);
router.post("/reset-member-password", resetMemberPassword);
router.post("/creator-password", creatorForgot);
router.post("/reset-creator-password", resetCreatorPassword);

module.exports = router;
