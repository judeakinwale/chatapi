/**
 * General Docs: https://developers.facebook.com/docs/development
 *
 * https://developers.facebook.com/docs/messenger-platform/overview
 * Working with facebook messenger and instagram messenger
 */

const { default: axios } = require("axios");

/**
 * @summary Get All Conversations
 * @param {str} platform ["instagram", "messenger"]
 * @example
 * curl -i -X GET "https://graph.facebook.com/LATEST-API-VERSION/PAGE-ID/conversations
    ?platform=PLATFORM
    &access_token=PAGE-ACCESS-TOKEN" 
 * @response
 * {
  "data": 
    {
      "id": "CONVERSATION-ID-1",  
      "updated_time": "UNIX-TIMESTAMP"
    },
    {
      "id": "CONVERSATION-ID-2",   
      "updated_time": "UNIX-TIMESTAMP"
    }
    ...
  ]
}
 */
const getAllConversations = async (platform = "instagram") => {
  const PLATFORM = platform;
  const url = `https://graph.facebook.com/LATEST-API-VERSION/PAGE-ID/conversations?platform=${PLATFORM}&access_token=PAGE-ACCESS-TOKEN`;

  const response = await axios.get(url);
  return response.data;
};



// const getAllMessengerConversations = async (
//   token,
//   template = "hello_world",
//   reciepients = []
// ) => {
//   const url =
//     "https://graph.facebook.com/LATEST-API-VERSION/PAGE-ID/conversations";
//   const payload = {
//     messaging_product: "whatsapp",
//     to: reciepients[0],
//     // to: reciepients,
//     type: "template",
//     template: { name: template, language: { code: "en_US" } },
//   };
//   const options = {
//     headers: { Authorization: `Bearer ${token}` },
//   };
//   const response = await axios.post(url, payload, options);
//   return response.data;
// };
