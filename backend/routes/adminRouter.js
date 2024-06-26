const express = require("express");

const {
    getCreators,
    getCurrentCreatorIdentityCheck,
    changeVerificationState,
    getConflicts,
    payCreator
} = require("../controllers/adminController");
const { adminProtect } = require("../middleware/authAdminMiddleware");

const router = express.Router();
router.get("/creators", adminProtect, getCreators);
router.get("/creators/:creatorId", adminProtect, getCurrentCreatorIdentityCheck);
router.put("/creators/:creatorId/change-verification-state", adminProtect, changeVerificationState);
router.get("/conflicts", adminProtect, getConflicts);
router.post("/invoices/:invoiceId", adminProtect, payCreator);


module.exports = router;
