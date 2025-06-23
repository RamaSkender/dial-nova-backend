const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const WebSocket = require('ws');
const { transcribeAudio, generateResponse } = require('./openai');
const { systemPrompt } = require('../config/prompts');
const { textToSpeech } = require('./elevenlabs');
const phoneNumbersRouter = require('./routes/phoneNumbers');
const callsRouter = require('./routes/calls');
const authRouter = require('./routes/auth');
const supabase = require('./supabase');
const { errorHandler } = require('./middleware/errorHandler');
const appConfig = require('../config/appConfig');

const app = express();
const port = appConfig.port;
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/phone-numbers', phoneNumbersRouter);
app.use('/api/calls', callsRouter);
app.use('/api/auth', authRouter);

app.post('/twilio-status-callback', async (req, res) => {
  const { CallSid, CallStatus } = req.body;

  try {
    const { error } = await supabase
      .from('call_logs')
      .update({ status: CallStatus })
      .eq('call_sid', CallSid);

    if (error) {
      console.error('Error updating call status in Supabase:', error);
      // Still send a 200 OK to Twilio to acknowledge receipt
    }

    res.status(200).send();
  } catch (error) {
    console.error('Error in status callback handler:', error);
    res.status(500).send();
  }
});

// Not found handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// This should be the last middleware
app.use(errorHandler);

const VoiceResponse = require('twilio').twiml.VoiceResponse;

const conversationHistory = {};

app.get('/', (req, res) => {
  res.send('Voice AI Call Automation Server is running!');
});

app.post('/twilio-webhook', (req, res) => {
  const twiml = new VoiceResponse();
  
  twiml.say('Connecting to the AI. Please wait a moment.');

  const connect = twiml.connect();
  connect.stream({
    url: `wss://${req.headers.host}`, // Assumes same host for HTTP and WSS
  });

  res.type('text/xml');
  res.send(twiml.toString());
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');

  ws.on('message', async (message) => {
    const msg = JSON.parse(message);

    if (msg.event === 'start') {
      ws.callSid = msg.start.callSid;
      console.log(`WebSocket connection started for call SID: ${ws.callSid}`);
      if (!conversationHistory[ws.callSid]) {
        conversationHistory[ws.callSid] = [{ role: 'system', content: systemPrompt }];
      }
    } else if (msg.event === 'media') {
      const data = Buffer.from(msg.media.payload, 'base64');
      // Placeholder for transcription logic
      // For now, we'll just log it.
      // In a real implementation, you would send this audio data to a speech-to-text service.
      // console.log(`Received audio chunk of size: ${data.length}`);

      // Placeholder for generating a response with an LLM
      if (msg.event === 'media') {
        const transcript = "some transcribed text..."; // Placeholder
        generateResponse(transcript, ws.callSid);

        // Update transcript in Supabase
        const { data: log, error: logError } = await supabase
          .from('call_logs')
          .select('transcript')
          .eq('call_sid', ws.callSid)
          .single();

        if (logError) {
          console.error('Error fetching transcript:', logError);
          return;
        }

        const updatedTranscript = log.transcript ? `${log.transcript}\n${transcript}` : transcript;

        const { error: updateError } = await supabase
          .from('call_logs')
          .update({ transcript: updatedTranscript })
          .eq('call_sid', ws.callSid);

        if (updateError) {
          console.error('Error updating transcript:', updateError);
        }
      }
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
    if (ws.callSid) {
      delete conversationHistory[ws.callSid];
    }
  });
});

module.exports = app; 