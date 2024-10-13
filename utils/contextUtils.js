const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const { cleanAndTokenize } = require("./chatUtils");
// const pptxParser = require("pptx-parser");

// Helper function to convert buffer to base64
const bufferToBase64 = (buffer) => {
  return buffer.toString("base64");
};

// Extract text and images from PDF
async function extractPdf(fileBuffer) {
  try {
    const data = await pdfParse(fileBuffer);

    // Handle text extraction
    const text = data.text;

    // Assuming we have images embedded, convert them to base64 (requires a custom approach depending on the pdf-parse options)
    const images = []; // Base64 encoded images

    // Handle your logic for extracting images from the PDF buffer if needed.

    return { text, images };
  } catch (error) {
    throw new Error("Error extracting PDF content: " + error.message);
  }
}

// Extract text and images from DOCX
async function extractDocx(fileBuffer) {
  try {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });

    console.log({ fileBuffer, result: Object.keys(result) });

    const text = result.value; // Text from docx

    // Mammoth also supports image extraction, but you'll need to configure it
    // Use a custom image handler to extract and base64 encode images.
    const options = {
      convertImage: mammoth.images.inline((element) => {
        return element.read("base64").then(function (imageBuffer) {
          return {
            src: "data:" + element.contentType + ";base64," + imageBuffer,
          };
        });
      }),
    };

    const { value, images } = await mammoth.convertToHtml(
      { buffer: fileBuffer },
      options
    );
    return { text, images };
  } catch (error) {
    throw new Error("Error extracting DOCX content: " + error.message);
  }
}

// Extract text from plain text files
async function extractText(fileBuffer) {
  try {
    const text = fileBuffer.toString("utf8");
    return { text, images: [] };
  } catch (error) {
    throw new Error("Error extracting text file content: " + error.message);
  }
}

// Extract text and images from PPTX
// async function extractPptx(fileBuffer) {
//   try {
//     const presentation = await pptxParser.parse(fileBuffer);
//     let text = "";
//     const images = [];

//     presentation.slides.forEach((slide) => {
//       // Extract text from slides
//       if (slide.text) {
//         text += slide.text;
//       }

//       // Extract images from slides and encode them in base64
//       slide.images.forEach((image) => {
//         const base64Image = bufferToBase64(image.raw);
//         images.push({ src: `data:${image.mimeType};base64,${base64Image}` });
//       });
//     });

//     return { text, images };
//   } catch (error) {
//     throw new Error("Error extracting PPTX content: " + error.message);
//   }
// }

// Main function to determine file type and extract accordingly (get file from file path)
async function extractFileContentFromPath(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const extension = filePath.split(".").pop().toLowerCase();

  switch (extension) {
    case "pdf":
      return await extractPdf(fileBuffer);
    case "docx":
      return await extractDocx(fileBuffer);
    case "txt":
      return await extractText(fileBuffer);
    // case "pptx":
    //   return await extractPptx(fileBuffer);
    default:
      throw new Error("Unsupported file format");
  }
}

// Main function to determine file type and extract accordingly (get file from req.files)
async function extractFileContent(file) {
  const fileBuffer = file.data; // Use file.data for buffer from req.files
  const extension = file.name.split(".").pop().toLowerCase();

  console.log({ extension });

  switch (extension) {
    case "pdf":
      return await extractPdf(fileBuffer);
    case "docx":
      return await extractDocx(fileBuffer);
    case "txt":
      return await extractText(fileBuffer);
    // case "pptx":
    //   return await extractPptx(fileBuffer);
    default:
      throw new Error("Unsupported file format");
  }
}

// // Usage example
// (async () => {
//   try {
//     // const result = await extractFileContentFromPath("./example.pdf");
//     console.time("reading 1.1mb docs");
//     const result = await extractFileContentFromPath("./QCDoc.pdf");
//     // const result = await extractFileContentFromPath("./ConfirmationDoc.docx");
//     console.timeEnd("reading 1.1mb docs");
//     // console.log("Text:", result.text);
//     console.log("Images:", result.images);

//     // fs.writeFileSync("./context.txt", result.text, "utf-8")
//     fs.appendFileSync(
//       "./context.txt",
//       cleanAndTokenize(result?.text)?.join(" ") + "\n",
//       "utf-8"
//     );
//   } catch (error) {
//     console.error(error);
//   }
// })();

module.exports = {
  bufferToBase64,
  extractPdf,
  extractDocx,
  extractText,
  // extractPptx,
  extractFileContentFromPath,
  extractFileContent,
};
