import "dotenv/config";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const getGroqAPIResponse = async (message) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    return completion.choices[0].message.content;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default getGroqAPIResponse;
