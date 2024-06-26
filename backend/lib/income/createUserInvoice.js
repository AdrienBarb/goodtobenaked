const Invoice = require('../../models/invoiceModel');
const generateInvoice = require('../pdf/generateInvoice');
const emailService = require('../email');
const { getUserIncomes } = require('./getIncomes');
const saleModel = require('../../models/saleModel');

const createUserInvoice = async (user) => {
  try {
    const incomes = await getUserIncomes(user);

    const sales = await saleModel.find({ owner: user, isPaid: false });

    const currentBalance = sales.reduce(
      (acc, currentValue) => acc + currentValue.amount.baseValue,
      0,
    );

    console.log('currentBalance ', currentBalance);

    if (currentBalance === 0) {
      return;
    }

    if (!user?.bankAccount?.name || !user?.bankAccount?.iban) {
      emailService.notifyCreatorForMissingBankDetails(user.email);
      return;
    }

    const { invoiceTitle, filePath } = await generateInvoice(user, incomes);

    await Invoice.create({
      user: user,
      title: invoiceTitle,
      path: filePath,
      paid: false,
      toBePaid: currentBalance / 100,
    });

    await saleModel.updateMany(
      { owner: user, isPaid: false },
      {
        isPaid: true,
      },
    );
  } catch (error) {
    console.error('Error createUserInvoice ', error);
    throw error;
  }
};

module.exports = {
  createUserInvoice,
};
