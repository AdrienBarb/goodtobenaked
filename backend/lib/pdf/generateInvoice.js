const PDFDocument = require('pdfkit-table');
const blobStream = require('blob-stream');
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require('@aws-sdk/client-s3');
const moment = require('moment');
const invoiceModel = require('../../models/invoiceModel');
const config = require('../../config');

const generateInvoice = async (user, currentBalance) => {
  try {
    const invoices = await invoiceModel.find({
      user: user,
    });

    const invoiceRef = invoices.length;
    const invoiceName = `${user.pseudo} - ${moment().format('DD/MM/YY')} - ${
      invoices.length
    }`;
    const pdfKey = `invoice/${user._id.toString()}/${invoiceRef}.pdf`;

    if (process.env.NODE_ENV !== 'test') {
      const s3 = new S3Client({
        credentials: {
          accessKeyId: config.awsAccessKeyId,
          secretAccessKey: config.awsSecretAccessKey,
        },
        region: config.awsRegion,
      });

      const doc = new PDFDocument();

      // Set document properties
      doc.info.Title = invoiceName;
      doc.info.Subject = 'Invoice';
      doc.info.Keywords = 'Invoice, PDF, JavaScript';

      doc
        .font('Helvetica-Bold')
        .fontSize(16)
        .text(`Facture`, 50, 50)
        .moveDown()
        .fontSize(10)
        .text(`Référence de facture : ${invoiceRef}`)
        .text(`Émise le : ${moment().format('DD/MM/YYYY')}`);

      if (user?.bankAccount?.name) {
        doc
          .font('Helvetica')
          .fontSize(8)
          .text('AU NOM ET POUR LE COMPTE DE', 50, 140, { align: 'left' })
          .moveTo(50, 150)
          .lineTo(200, 150)
          .stroke()
          .font('Helvetica-Bold')
          .fontSize(12)
          .text(user.bankAccount.name, 50, 160);
      }

      // add a table for the product sale
      doc
        .font('Helvetica-Bold')
        .fontSize(12)
        .text('Récapitulatif :', 50, 250, { align: 'left' })
        .moveDown();

      doc.table({
        headers: ['Désignation', 'Montant (€)'],
        rows: ['Sales', currentBalance / 100],
        layout: 'lightHorizontalLines',
        widths: [300, 100, 100],
      });

      doc
        .moveDown()
        .moveDown()
        .moveDown()
        .fontSize(12)
        .text('Cette facture est payée. Merci !', { align: 'left' });

      doc.end();

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));

      doc.on('end', async () => {
        const pdfData = Buffer.concat(buffers);
        const profilPictureCommand = new PutObjectCommand({
          Bucket: config.s3BucketProcessedMedia,
          Key: pdfKey,
          Body: pdfData,
          ContentType: 'application/pdf',
        });

        await s3.send(profilPictureCommand);
      });
    }

    return { invoiceTitle: invoiceName, filePath: pdfKey };
  } catch (error) {
    console.log(error);
    throw new Error('Error generating invoice');
  }
};

module.exports = generateInvoice;
