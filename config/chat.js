const {
  OpenAIClient,
  AzureKeyCredential,
  OpenAIKeyCredential,
} = require("@azure/openai");

const endpoint = process.env["AZURE_OPENAI_ENDPOINT"];
const azureApiKey = process.env["AZURE_OPENAI_KEY"];
const deploymentName = process.env["AZURE_OPENAI_DEPLOYMENT_NAME"];

const openaiKey = process.env["OPENAI_KEY"];

const { Configuration, OpenAIApi } = require("azure-openai");

// const prompt = ["When was Microsoft founded?"];

async function connectAI() {
  console.log("== Connecting Using Client ==");

  // ? For Azure Open AI Client (azure-openai)
  // const openAiApi = new OpenAIApi(
  //   new Configuration({
  //     apiKey: this.apiKey,
  //     // add azure info into configuration
  //     azure: {
  //       apiKey: azureApiKey,
  //       endpoint: endpoint,
  //       // deploymentName is optional, if you donot set it, you need to set it in the request parameter
  //       deploymentName: deploymentName,
  //     },
  //   })
  // );

  // // TODO: uncomment this for azure open ai
  // return openAiApi;

  // ? For Azure Open AI (@azure/openai   js)
  const client = new OpenAIClient(
    endpoint,
    new AzureKeyCredential(azureApiKey)
  );

  // ? For Open AI
  // const client = new OpenAIClient(new OpenAIKeyCredential(openaiKey));

  // // const deploymentId = "text-davinci-003";
  // // const result = await client.getCompletions(deploymentId, prompt);

  // // for (const choice of result.choices) {
  // //   console.log(choice.text);
  // // }

  return client;
}

// connectAI().catch((err) => {
//   console.error("Error contacting the server:".bgRed, err);
//   // console.error("The sample encountered an error:", err);
// });

module.exports = { connectAI };
