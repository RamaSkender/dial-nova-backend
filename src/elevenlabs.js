require('dotenv').config();
const { ElevenLabsClient } = require("@elevenlabs/elevenlabs-js");
const { elevenLabsApiKey } = require('../config/appConfig');
const elevenLabsConfig = require('../config/elevenlabs');

const elevenlabs = new ElevenLabsClient({
  apiKey: elevenLabsApiKey
});

const audioCache = new Map();

async function textToSpeech(text) {
  if (audioCache.has(text)) {
    return audioCache.get(text);
  }

  try {
    const audio = await elevenlabs.generate({
      voice: elevenLabsConfig.voice,
      text: text,
      model_id: elevenLabsConfig.model_id
    });

    const chunks = [];
    for await (const chunk of audio) {
      chunks.push(chunk);
    }

    const audioBuffer = Buffer.concat(chunks);
    audioCache.set(text, audioBuffer);
    return audioBuffer;
  } catch (error) {
    console.error('Error generating audio from ElevenLabs:', error);
    throw error;
  }
}

module.exports = {
  textToSpeech,
}; 