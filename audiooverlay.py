# from moviepy.editor import VideoFileClip, AudioFileClip, CompositeAudioClip
# import requests
# from bs4 import BeautifulSoup
# from flask import Flask, jsonify, request
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)
# @app.route('/video-endpoint', methods=['GET'])
# def call_article_text():
#     print("ENTEREED")
#     # send a GET request to the URL
#     # Load the video
#     video_clip = VideoFileClip("/Users/Ally_Mac/hackathon/twitterbio/subwaysurfers.mp4")

#     # Add a text clip onto the video
#     audio_file = "/Users/Ally_Mac/hackathon/twitterbio/public/test.wav"
#     output_file = 'public/final_video.mp4'

#     # video_clip = VideoFileClip(video_file)
#     audio_clip = AudioFileClip(audio_file)

#     if video_clip.duration > audio_clip.duration:
#         video_clip = video_clip.subclip(0, audio_clip.duration)

#     composite_audio = CompositeAudioClip([audio_clip])
#     video_clip = video_clip.set_audio(composite_audio)
#     video_clip.write_videofile(output_file, audio_codec='aac')
#     return jsonify({'result': output_file})

# if __name__ == '__main__':
#     app.run()






