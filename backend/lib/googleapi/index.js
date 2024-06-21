const { google } = require("googleapis");

const creatorInscriptionGoogleSheet = async (firstname, lastname, email) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const authClientObject = await auth.getClient();

  const googleSheetsInstance = google.sheets({
    version: "v4",
    auth: authClientObject,
  });

  const spreadsheetId = "1ilhozfwvy3jp8N1mDTEqAgvffH-x0Snh8-8RofPxm_c";

  const writingReq = await googleSheetsInstance.spreadsheets.values.append({
    spreadsheetId,
    range:
      process.env.NODE_ENV === "production"
        ? "creators!A:B"
        : "creators-test!A:B",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[firstname, lastname, email]],
    },
  });

  return writingReq;
};

const memberInscriptionGoogleSheet = async (firstname, lastname, email) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const authClientObject = await auth.getClient();

  const googleSheetsInstance = google.sheets({
    version: "v4",
    auth: authClientObject,
  });

  const spreadsheetId = "1ilhozfwvy3jp8N1mDTEqAgvffH-x0Snh8-8RofPxm_c";

  const writingReq = await googleSheetsInstance.spreadsheets.values.append({
    spreadsheetId,
    range:
      process.env.NODE_ENV === "production"
        ? "members!A:B"
        : "members-test!A:B",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[firstname, lastname, email]],
    },
  });

  return writingReq;
};

module.exports = {
  creatorInscriptionGoogleSheet,
  memberInscriptionGoogleSheet,
};
