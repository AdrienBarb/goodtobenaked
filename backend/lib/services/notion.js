const axios = require('axios');
const config = require('../../config');

const createNotionCard = async (product) => {
  try {
    if (!product) {
      return;
    }

    const response = await axios.post(
      'https://api.notion.com/v1/pages',
      {
        parent: {
          type: 'database_id',
          database_id: 'f11a655410bb4a0b89676b1c1eb1b18d',
        },
        properties: {
          Nom: {
            title: [
              {
                text: {
                  content: 'Tweet produit',
                },
              },
            ],
          },
          Tweet: {
            rich_text: [
              {
                text: {
                  content: "Viens découvrir d'autres produits comme celui-là !",
                },
              },
            ],
          },
          Hashtags: {
            rich_text: [
              {
                text: {
                  content: '#paypig #fetichiste #culotte #soumis #findom',
                },
              },
            ],
          },
          'Share Url': {
            url: `${config.clientUrl}/products/${product?._id}`,
          },
          'Picture Url': {
            url: `${config.cloudfrontUrl}${product?.productPicturesKeys?.[0]}`,
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${config.notionApiKey}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2021-05-13',
        },
      },
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const createCreatorNotionCard = async (creator) => {
  try {
    if (!creator) {
      return;
    }

    let properties = {
      Nom: {
        title: [
          {
            text: {
              content: 'Tweet creator',
            },
          },
        ],
      },
      Tweet: {
        rich_text: [
          {
            text: {
              content: 'Viens vite voir son profil :',
            },
          },
        ],
      },
      Hashtags: {
        rich_text: [
          {
            text: {
              content: '#paypig #fetichiste #culotte #soumis #findom',
            },
          },
        ],
      },
      'Share Url': {
        url: `${config.clientUrl}/creators/${creator?._id}`,
      },
    };

    if (creator?.profilPicture) {
      properties['Picture Url'] = {
        url: `${config.cloudfrontUrl}${creator?.profilPicture}`,
      };
    }

    const response = await axios.post(
      'https://api.notion.com/v1/pages',
      {
        parent: {
          type: 'database_id',
          database_id: 'f11a655410bb4a0b89676b1c1eb1b18d',
        },
        properties: properties,
      },
      {
        headers: {
          Authorization: `Bearer ${config.notionApiKey}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2021-05-13',
        },
      },
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createNotionCard,
  createCreatorNotionCard,
};
