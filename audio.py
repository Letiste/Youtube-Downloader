import os
from pydub import AudioSegment
os.environ["PATH"] += os.pathsep + 'C:\\Users\\olivi\\Anaconda3\\Library\\bin\\'
songs_dirs = [os.path.abspath("../../MusiquePlaylist/general/"), os.path.abspath("../../MusiquePlaylist/sport/")]

NORMALIZE_AMPLITUDE = -30

for songs_dir in songs_dirs:
  files = list(filter(lambda file : file.endswith('.m4a'), os.listdir(songs_dir)))
  for i in range (len(files)):
    song_file = files[i]
    song_file_path = songs_dir + '\\' + song_file
    song = AudioSegment.from_file(song_file_path)
    song_reduced = song + (NORMALIZE_AMPLITUDE - song.dBFS)
    print(song_file)
    # print(song_file[:-4] + ".wav")
    print(song.dBFS)
    # print(song_reduced.dBFS)
    print("----------")
    song_reduced.export(song_file_path[:-4] + ".wav", format="wav")
    os.remove(song_file_path)
