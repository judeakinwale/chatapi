const fs = require("fs");
const { connectAI } = require("../config/chat");
const { OpenAIClient } = require("@azure/openai");
const { OpenAIApi } = require("azure-openai");

const MAX_TOKENS = 512;

async function getResponseAI(
  query = "When was Microsoft founded?",
  req = undefined
) {
  console.log("== Get response Sample ==");

  const prompt = [query];

  // const client = await connectAI()
  const client = req ? req.aiClient : await connectAI();
  // const deploymentId = "text-davinci-003";
  const deploymentId = "gpt-3.5-turbo";
  const result = await client.getCompletions(deploymentId, prompt, {
    maxTokens: MAX_TOKENS,
  });

  const resultText = [];
  let ttext = "";
  for (const choice of result.choices) {
    console.log(choice.text);
    // ttext = `${ttext}, ${choice.text}`
    resultText.push(cleanUpText(choice.text));
    // resultText.push(choice.text);
  }

  ttext = resultText.toString();

  console.log({ result, resultText, ttext });
  try {
    // write result to file for debugging
    fs.writeFile("build/ai_response.md", String(ttext), "utf8", () => {});
  } catch (error) {
    console.log({ error: error.message });
  }

  return ttext;
}

function cleanAndTokenize(text) {
  // Remove punctuation, new lines, and escaped characters
  const cleanedText = text
    .replace(/[\r\n]+/g, " ") // Replace new lines with a single space
    // .replace(/[^\w\s]/g, "") // Remove punctuation
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
    .trim(); // Trim leading/trailing spaces
  // .toLowerCase(); // Convert to lowercase

  // Split the cleaned text into an array of words (tokens)
  const tokens = cleanedText.split(" "); // Split by single space

  return tokens;
}

function getDetailedPrompt(prompt = [], context = "") {
  const detailedPrompt = [
    {
      role: "system",
      content:
        "You are an assistant for a company that provides IT solutions and services",
    },
    !!context && {
      role: "system",
      content: cleanAndTokenize(
        `Provided below is the data to use as your primary source of information. 
        Recommend links to information provided below if they are related. 
        If there are lists of javascript objects in a section of the text below, they are sorted such that the most relevant to the section are at the start ${context}`
      )?.join(" "),
    },
    ...prompt,
  ]?.filter(Boolean);
  return detailedPrompt;
}

// async function getResponseAI(query = "When was Microsoft founded?", req = undefined) {
async function getChatResponseAI(
  prompt = [{ role: "user", content: "When was Microsoft founded?" }],
  req = undefined,
  res = undefined
) {
  console.log("== Get response Sample ==");

  // // const prompt = [query];
  // const detailedPrompt = [
  //   {
  //     role: "system",
  //     content:
  //       "You are an assistant for a company that provides IT solutions and services",
  //   },
  //   ...prompt,
  // ];

  const detailedPrompt = prompt;

  // console.log({ prompt, detailedPrompt });
  console.log({ detailedPrompt });

  // const client = await connectAI()
  const client = req ? req.aiClient : await connectAI();

  let events;

  if (client instanceof OpenAIApi) {
    console.log("OpenAIApi used!!!");

    console.log({ client });

    const model = "gpt-4o-mini";
    // const model = 'gpt-4o';
    // const model = "gpt-3.5-turbo";

    const stream = await client.createChatCompletion({
      model: model,
      messages: detailedPrompt,
      stream: true,
    });

    events = stream;
  }

  if (client instanceof OpenAIClient) {
    console.log("OpenAIClient used!!!");

    // const deploymentId = "text-davinci-003";
    // const deploymentId = "gpt-3.5-turbo";
    // const deploymentId = "gpt-4o-mini";
    const deploymentId = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "Testing";

    // const result = await client.getCompletions(deploymentId, prompt, {
    // const result = await client.getCompletions(deploymentId, detailedPrompt, {
    // const result = await client.listChatCompletions(
    //   deploymentId,
    //   detailedPrompt,
    //   {
    //     maxTokens: MAX_TOKENS,
    //   }
    // );

    const eventsResponse = await client.listChatCompletions(
      deploymentId,
      detailedPrompt,
      {
        maxTokens: MAX_TOKENS,
      }
    );
    // .listChatCompletions()

    // console.log({ events });
    events = eventsResponse;
  }

  const resultText = [];
  let ttext = "";
  // for (const choice of result.choices) {
  //   console.log(choice.text);
  //   // ttext = `${ttext}, ${choice.text}`
  //   resultText.push(cleanUpText(choice.text));
  //   // resultText.push(choice.text);
  // }
  let contentTextList = [];
  let contentText = "";
  for await (const event of events) {
    const preContent = event.choices[0]?.delta?.content || "";
    process.stdout.write(preContent);

    res.write(preContent);

    // console.log({ event });
    // contentText = "";

    for (const choice of event.choices) {
      // console.log({ choice });

      const delta = choice.delta?.content;
      if (delta !== undefined) {
        // console.log(`Chatbot: ${delta}`);
        // console.log(choice.text);
        // // ttext = `${ttext}, ${choice.text}`
        // resultText.push(cleanUpText(choice.text));
        // // resultText.push(choice.text);
        contentText = contentText + delta;
        // console.log({contentText})

        // res?.write(contentText);
      }
    }
    // console.log(delta);
    // resultText.push(cleanUpText(delta));
  }
  // resultText.push(cleanUpText(contentText));
  // contentTextList.push(cleanUpText(contentText));

  resultText.push(contentText);
  contentTextList.push(contentText);

  // console.log({ contentTextList });

  ttext = resultText.toString();

  // console.log({ result, resultText, ttext });
  // console.log({ resultText, ttext });
  try {
    // write result to file for debugging
    fs.writeFile("build/ai_chat_response.md", String(ttext), "utf8", () => {});
  } catch (error) {
    console.log({ error: error.message });
  }

  return ttext;
}

async function getResponseOpenAI(query = "test") {
  console.log("Starting openai completion");
  // const { OpenAI } = require("openai");

  // const openai = new OpenAI({
  //   apiKey: process.env.OPENAI_API_KEY,
  // });

  // const chatCompletion = await openai.chat.completions.create({
  //   messages: [{ role: "user", content: "Say this is a test" }],
  //   model: "gpt-3.5-turbo",
  // });

  // console.log({chatCompletion, query})
  // return chatCompletion
}

function cleanUpText(inputText) {
  // Remove leading and trailing white spaces
  let cleanedText = inputText.trim();

  // Convert text to lowercase
  // cleanedText = cleanedText.toLowerCase();

  // Remove special characters and punctuation
  // cleanedText = cleanedText.replace(/[^\w\s]/g, '');

  // Remove extra spaces between words
  cleanedText = cleanedText.replace(/\s+/g, " ");

  return cleanedText;
}

// getResponseAI().catch((err) => {
//   console.error("Error contacting the server:", err);
//   console.error("The sample encountered an error:", err);
// });

module.exports = {
  getResponseAI,
  getChatResponseAI,
  getResponseOpenAI,
  cleanAndTokenize,
  getDetailedPrompt,
};
