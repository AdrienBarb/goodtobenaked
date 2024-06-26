const express = require("express");

const {
    changeCustomDemandStateMember,
    changeCustomDemandStateCreator
} = require("../controllers/messageController");
const { creatorProtect } = require("../middleware/authCreatorMiddleware");
const { memberProtect } = require("../middleware/authMemberMiddleware");

const router = express.Router();

router.put("/creator-change-state", creatorProtect, changeCustomDemandStateCreator);
router.put("/member-change-state", memberProtect, changeCustomDemandStateMember);


module.exports = router