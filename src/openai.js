require('dotenv').config();
const OpenAI = require('openai');

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('OpenAI API key is not set in the environment variables. Please check your .env file.');
}

const openai = new OpenAI({
  apiKey: apiKey,
});

async function transcribeAudio(audioBuffer) {
  try {
    // Note: This assumes the audioBuffer is in a format Whisper can process (e.g., WAV).
    // In a real application, you would need to handle the µ-law to WAV conversion.
    const response = await openai.audio.transcriptions.create({
      model: 'whisper-1',
      file: audioBuffer, // This expects a file-like object or buffer
    });
    return response.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
}

async function generateResponse(conversation) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: conversation,
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}

module.exports = {
  openai,
  transcribeAudio,
  generateResponse,
}; 