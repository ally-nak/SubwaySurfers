import requests
from bs4 import BeautifulSoup
from flask import Flask, jsonify, request
from flask_cors import CORS
from moviepy.editor import VideoFileClip, AudioFileClip, CompositeAudioClip


app = Flask(__name__)
CORS(app)
@app.route('/scraper-endpoint', methods=['POST'])
def call_article_text():
    print("ENTEREED")
    # send a GET request to the URL
    url = request.json['url']
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    # kill all script and style elements
    for script in soup(["script", "style"]):
        script.extract()    # rip it out

    # get text
    text = soup.get_text()

    # break into lines and remove leading and trailing space on each
    lines = (line.strip() for line in text.splitlines())
    # break multi-headlines into a line each
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    # drop blank lines
    text = '\n'.join(chunk for chunk in chunks if chunk)
    print(text.encode('utf-8'))
    return jsonify({'result': text})

@app.route('/video-endpoint', methods=['GET'])
def create_video():
    print("ENTEREED")
    # send a GET request to the URL
    # Load the video
    video_clip = VideoFileClip("/Users/Ally_Mac/hackathon/twitterbio/subwaysurfers.mp4")

    # Add a text clip onto the video
    audio_file = "/Users/Ally_Mac/hackathon/twitterbio/public/test.wav"
    output_file = 'public/final_video.mp4'

    # video_clip = VideoFileClip(video_file)
    audio_clip = AudioFileClip(audio_file)

    if video_clip.duration > audio_clip.duration:
        video_clip = video_clip.subclip(0, audio_clip.duration)

    composite_audio = CompositeAudioClip([audio_clip])
    video_clip = video_clip.set_audio(composite_audio)
    video_clip.write_videofile(output_file, audio_codec='aac')
    return jsonify({'result': output_file})

if __name__ == '__main__':
    app.run()


