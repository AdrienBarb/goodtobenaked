const asyncHandler = require('express-async-handler');
const Invoice = require('../models/invoiceModel');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const emailService = require('../lib/email');
const { notifySlack } = require('../lib/services/slack');
const saleModel = require('../models/saleModel');
const userModel = require('../models/userModel');
const config = require('../config');
const generateInvoice = require('../lib/pdf/generateInvoice');
const calculateCurrentBalanceWithCommission = require('../lib/utils/calculateCurrentBalanceWithCommission');

const getBalances = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);

  const sales = await saleModel.find({ owner: user, isPaid: false });

  const currentBalance = calculateCurrentBalanceWithCommission(sales, user);

  res.status(200).json({
    balances: currentBalance,
  });
});

const getSales = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);
  const { cursor } = req.query;

  const filter = {
    owner: user,
  };

  if (cursor) {
    filter.createdAt = { $lt: new Date(cursor) };
  }

  const sales = await saleModel
    .find(filter)
    .limit(50)
    .sort({ createdAt: -1 })
    .populate('fromUser');

  const nextCursor =
    sales.length > 0 ? sales[sales.length - 1].createdAt : null;

  res.status(200).json({ sales, nextCursor });
});

const getInvoices = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);
  const { cursor } = req.query;

  const filter = {
    user: user,
  };

  if (cursor) {
    filter.createdAt = { $lt: new Date(cursor) };
  }

  const invoices = await Invoice.find(filter).limit(50).sort({ createdAt: -1 });

  const nextCursor =
    invoices.length > 0 ? invoices[invoices.length - 1].createdAt : null;

  res.status(200).json({ invoices, nextCursor });
});

const createInvoice = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);

  const sales = await saleModel.find({ owner: user, isPaid: false });

  const currentBalance = calculateCurrentBalanceWithCommission(sales, user);

  if (currentBalance === 0) {
    return;
  }

  if (!user?.bankAccount?.name || !user?.bankAccount?.iban) {
    emailService.notifyCreatorForMissingBankDetails(user.email);
    return;
  }

  const { invoiceTitle, filePath } = await generateInvoice(
    user,
    currentBalance,
  );

  await Invoice.create({
    user: user,
    title: invoiceTitle,
    path: filePath,
    paid: false,
    toBePaid: currentBalance,
  });

  await saleModel.updateMany(
    { owner: user, isPaid: false },
    {
      isPaid: true,
    },
  );

  if (user.emailNotification) {
    emailService.creatorAskPayment(user.email);
  }

  //Slack notification
  await notifySlack('Une demande de paiement');

  res.status(200).json('Success');
});

const downloadInvoice = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);
  const { invoiceId } = req.params;

  try {
    const invoice = await Invoice.findById(invoiceId);

    const s3 = new S3Client({
      credentials: {
        accessKeyId: config.awsAccessKeyId,
        secretAccessKey: config.awsSecretAccessKey,
      },
      region: config.awsRegion,
    });

    const getObjectParams = {
      Bucket: config.s3BucketProcessedMedia,
      Key: invoice?.path,
    };

    // Use the GetObjectCommand
    const getObjectCommand = new GetObjectCommand(getObjectParams);
    const s3Object = await s3.send(getObjectCommand);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="your-file-name.pdf"`,
    );
    s3Object.Body.pipe(res);
  } catch (error) {
    res.status(400).json('Error');
    throw new Error(error);
  }
});

module.exports = {
  createInvoice,
  downloadInvoice,
  getInvoices,
  getBalances,
  getSales,
};
