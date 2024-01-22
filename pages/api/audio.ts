import { Request, Response } from 'express';
"use strict";

var sdk = require("microsoft-cognitiveservices-speech-sdk");

var audioFile = "public/test.wav";
if (!process.env.SPEECH_KEY || !process.env.SPEECH_REGION) {
    throw new Error("Missing env var from OpenAI");
  }
// This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY, process.env.SPEECH_REGION);
const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioFile);

// The language of the voice that speaks.
speechConfig.speechSynthesisVoiceName = "en-US-SaraNeural"; 

// Create the speech synthesizer.
var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

function speakTextSync(summary: string) {
    return new Promise<void>((resolve, reject) => {
      synthesizer.speakTextAsync(summary, (result: { reason: any; errorDetails: string; }) => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          console.log("synthesis finished.");
          resolve();
        } else {
          console.error(
            "Speech synthesis canceled, " +
              result.errorDetails +
              "\nDid you set the speech resource key and region values?"
          );
          reject(new Error("Speech synthesis canceled"));
        }
        synthesizer.close();
        synthesizer = null;
      }, (err: string) => {
        console.trace("err - " + err);
        reject(new Error("Speech synthesis failed"));
        synthesizer.close();
        synthesizer = null;
      });
    });
}

const handler = async (req: Request, res: Response): Promise<void> => {
    const { summary } = req.body as { summary?: string };
    console.log(summary);
    console.log(typeof summary);
    if (!summary) {
      res.status(400).json({ message: 'Audio conversion failed' });
      return;
    }
    if(!synthesizer) {
        synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
    }
  
    try {
      await speakTextSync(summary.toString());
      console.log('Speech synthesis completed successfully');
    } catch (error) {
      console.error('Speech synthesis failed:', error);
      res.status(500).json({ message: 'Speech synthesis failed' });
      return;
    }  
    console.log('Now synthesizing to:', audioFile);
    res.json({ audioFile });
  };
  
export default handler;

  

