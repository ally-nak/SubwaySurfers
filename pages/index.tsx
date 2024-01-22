import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { VibeType } from "../components/DropDown";
import Footer from "../components/Footer";
import Github from "../components/GitHub";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import AudioPlayer from "../components/AudioPlayer";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [vibe, setVibe] = useState<VibeType>("30 seconds");
  const [audioFile, setAudioFile] = useState<String>("");
  const [videoFile, setVideoFile] = useState<String>("final_video.mp4");

  const bioRef = useRef<null | HTMLDivElement>(null);

  const scrollToBios = () => {
    if (bioRef.current !== null) {
      bioRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const generateBio = async (e: any) => {
    e.preventDefault();
    setAudioFile("");
    setLoading(true);
    var text = "";
    const response = await fetch('http://127.0.0.1:5000/scraper-endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: bio
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log("HEREE");
      console.log(data);
      text = data.result;
    })
    .catch(error => {
      alert("There was an error fetching data from the article url. Please make sure the url is correct and try again");
    });

    if (text == "") {
      alert("There was an error fetching data from the article url. Please make sure the url is correct and try again");
    }

    var wordcount = "75";
    if (vibe == "1 minute") {
      wordcount = "150";
    } else if (vibe == "2 minute") {
      wordcount = "300";
    }
    const prompt = "The following is HTML text of an online article. Your goal is to summarize the most important parts of the article in less than " + wordcount + ". Format the text into an exciting podcast style script." + text;
    const gpt_response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!gpt_response.ok) {
      throw new Error(gpt_response.statusText);
    }

    // This data is a ReadableStream
    const data = gpt_response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    var summary = "";

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      summary += chunkValue;
    }

    var audioFile = "";
    const audio_response = await fetch("/api/audio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary,
      }),
    }).then(response => response.json())
    .then(data => {
      console.log("HEREE");
      console.log(data);
      audioFile = data.audioFile.replace("public/", "");
    })
    .catch(error => {
      alert("There was an error fetching the audio file");
    });
    console.log("AUDIO FILE", audioFile);
    setAudioFile(audioFile);

    var videoFile = "";
    const video_response = await fetch('http://127.0.0.1:5000/video-endpoint', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(response => response.json())
    .then(data => {
      console.log("HEREE");
      console.log(data);
      videoFile = data.result.replace("public/", "");
    })
    .catch(error => {
      alert("There was an error generating the video file");
    });
    console.log("VIDEO FILE", videoFile);
    setVideoFile(videoFile);
    scrollToBios();
    setLoading(false);
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Listen in Bite Size Chunks</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Summarize any article into a bite-size audio clip.
        </h1>
        <p className="text-slate-500 mt-5">Learn more, spend less.</p>
        <div className="max-w-xl w-full">
          <div className="flex mt-10 items-center space-x-3">
            <Image
              src="/1-black.png"
              width={30}
              height={30}
              alt="1 icon"
              className="mb-5 sm:mb-0"
            />
            <p className="text-left font-medium">
              Enter the article URL.{" "}              
            </p>
            </div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={2}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={
              "e.g. https://stanfordhatesfun.com/"
            }
          />
          <div className="flex mb-5 items-center space-x-3">
            <Image src="/2-black.png" width={30} height={30} alt="1 icon" />
            <p className="text-left font-medium">Select how long you want the audio summary to be.</p>
          </div>
          <div className="block">
            <DropDown vibe={vibe} setVibe={(newVibe) => setVibe(newVibe)} />
          </div>

          {!loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              onClick={(e) => generateBio(e)}
            >
              Generate your audio summary &rarr;
            </button>
          )}
          {loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )}
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <div className="space-y-10 my-10">
          {videoFile && (
            <>
              <div>
                <h2
                  className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                  ref={bioRef}
                >
                  Here's your audio summary!
                </h2>
              </div>
              <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
              <AudioPlayer src={videoFile.toString()}></AudioPlayer>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
