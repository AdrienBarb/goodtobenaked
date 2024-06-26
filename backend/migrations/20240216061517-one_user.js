module.exports = {
  async up(db, client) {
    const creators = await db.collection('creators').find().toArray();
    const members = await db.collection('members').find().toArray();

    for (const creator of creators) {
      await db.collection('users').insertOne({
        _id: creator._id,
        pseudo: creator.pseudo,
        email: creator.email,
        password: creator.password,
        userType: 'creator',
        gender: creator.gender || undefined,
        image: {
          profil: creator.profilPicture || '',
          banner: creator.bannerPicture || '',
        },
        emailNotification: creator.emailNotification || true,
        description: creator.description || '',
        socialMediaLink: {
          twitter: creator.twitterLink || '',
          instagram: creator.instagramLink || '',
          mym: creator.mymLink || '',
          onlyfans: creator.onlyfansLink || '',
        },
        breastSize: creator.breastSize || '',
        buttSize: creator.buttSize || '',
        bodyType: creator.bodyType || '',
        hairColor: creator.hairColor || '',
        age: creator.age || undefined,
        nationality: creator.nationality || '',
        verified: creator.verified,
        isAccountVerified: creator.verified === 'verified' ? true : false,
        emailVerified: creator.emailVerified,
        country: creator.country || '',
        salesFee: creator.salesFee,
        revenue: {
          isBankTransferAutomatic: creator.automaticPayment,
          invoices: creator.invoices || [],
          invoiceAddress: creator.invoiceAddress,
        },
        bankAccount: {
          name: creator.bankAccountName || '',
          iban: creator.bankAccountIBAN || '',
        },
        inappNotification: creator.inappNotification || [],
        lastLogin: creator.lastLogin || undefined,
        referredBy: creator.referredBy || undefined,
        notificationSubscribers: creator.notificationSubscribers || [],
        version: creator.version || 2,
        isAmbassador: creator.isAmbassador || false,
        isArchived: creator.isArchived || false,
        creditAmount: creator.creditAmount || 0,
        createdAt: creator.createdAt,
        updatedAt: creator.updatedAt,
      });
    }

    for (const member of members) {
      const exist = creators.some((el) => el.email === member.email);

      console.log('exist ', exist);

      if (!exist) {
        await db.collection('users').insertOne({
          _id: member._id,
          pseudo: member.pseudo,
          email: member.email,
          password: member.password,
          userType: 'member',
          emailNotification: member.emailNotification || true,
          verified: 'unverified',
          image: {
            profil: member.profilPicture || '',
          },
          revenue: {
            isBankTransferAutomatic: false,
            invoices: [],
          },
          version: 2,
          salesFee: 0.2,
          description: member.description || '',
          emailVerified: member.emailVerified || false,
          isAccountVerified: false,
          inappNotification: member.inappNotification || [],
          isArchived: member.isArchived || false,
          creditAmount: member.creditAmount || 0,
          notificationSubscribers: [],
          isAmbassador: false,
          createdAt: member.createdAt,
          updatedAt: member.updatedAt,
        });
      }
    }
  },

  async down(db, client) {},
};
