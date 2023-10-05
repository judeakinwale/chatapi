const { OpenAIClient, AzureKeyCredential, OpenAIKeyCredential } = require("@azure/openai");
// const endpoint = process.env["AZURE_OPENAI_ENDPOINT"];
// const azureApiKey = process.env["AZURE_OPENAI_KEY"];
const openaiKey = process.env["OPENAI_KEY"];

// const prompt = ["When was Microsoft founded?"];

async function connectAI() {
  console.log("== Get completions Sample ==");

  // ? For Azure Open AI
  // const client = new OpenAIClient(
  //   endpoint,
  //   new AzureKeyCredential(azureApiKey)
  // );

  // ? For Open AI
  const client = new OpenAIClient(new OpenAIKeyCredential(openaiKey));

  // const deploymentId = "text-davinci-003";
  // const result = await client.getCompletions(deploymentId, prompt);

  // for (const choice of result.choices) {
  //   console.log(choice.text);
  // }

  return client
}

// connectAI().catch((err) => {
//   console.error("Error contacting the server:".bgRed, err);
//   // console.error("The sample encountered an error:", err);
// });

module.exports = { connectAI };
