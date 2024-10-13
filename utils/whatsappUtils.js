/**
 * Whatsapp Pricing: https://developers.facebook.com/docs/whatsapp/pricing/
 * 
 * https://developers.facebook.com/docs/whatsapp/cloud-api/get-started
 * Working With Whatsapp Cloud API
 */

const { default: axios } = require("axios");

// TODO: create generic async handler

/**
 * @summary: create test template message
 * @example: 
 * curl -i -X POST \
  https://graph.facebook.com/v18.0/105954558954427/messages \
  -H 'Authorization: Bearer EAAFl...' \
  -H 'Content-Type: application/json' \
  -d '{ "messaging_product": "whatsapp", "to": "15555555555", "type": "template", "template": { "name": "hello_world", "language": { "code": "en_US" } } }'
 * 
 * 
 */
const sendTemplateMessage = async (
  token,
  template = "hello_world",
  reciepients = []
) => {
  const url = "https://graph.facebook.com/v18.0/105954558954427/messages";
  const payload = {
    messaging_product: "whatsapp",
    to: reciepients[0],
    // to: reciepients,
    type: "template",
    template: { name: template, language: { code: "en_US" } },
  };
  const options = {
    headers: { "Authorization": `Bearer ${token}` },
  };
  const response = await axios.post(url, payload, options);
  return response.data;
};
