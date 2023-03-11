const http = require('http');
const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const { spawn } = require('node:child_process');

const hostname = '127.0.0.1';
const port = 4897;
const playlistMusicPath = 'D:\\Documents\\MusiquePlaylist';

function downloadYtVideo(ytVideoUrl, playlists) {
  if (playlists.length === 0) return;
  playlists.forEach((playlist) => {
    if (!fs.existsSync(`${playlistMusicPath}\\${playlist}`)) {
      fs.mkdirSync(`${playlistMusicPath}\\${playlist}`);
    }
  });
  execFile(
    'yt-dlp',
    ['-f 140', '-o', `${playlistMusicPath}\\${playlists[0]}\\%(title)s.%(ext)s`, ytVideoUrl],
    (error, stdout, stderr) => {
      const timestamp = new Date().toISOString();
      if (error) {
        console.error(`${timestamp}:ERROR DOWNLOADING ${ytVideoUrl}\n${error}\n`);
      } else {
        console.log(`${timestamp}:SUCCESS DOWNLOADING ${ytVideoUrl}\n`);
        const musicFilePath = stdout.split('\n')[1].substring(24);
        const musicFileName = path.basename(musicFilePath);
        for (let i = 1; i < playlists.length; i++) {
          fs.copyFileSync(musicFilePath, `${playlistMusicPath}\\${playlists[i]}\\${musicFileName}`);
        }
        const ls = spawn('cmd.exe', ['/c', 'audio.bat']);
        ls.stdout.on('data', (data) => {
          console.log(`stdout: ${data}`);
        });

        ls.stderr.on('data', (data) => {
          console.error(`stderr: ${data}`);
        });
      }
    }
  );
}
const server = http.createServer((req, res) => {
  const params = new URL(`http://${hostname}:${port}${req.url}`).searchParams;
  const ytVideoUrl = params.get('url');
  const playlists = params.getAll('playlist');
  const timestamp = new Date().toISOString();
  console.log(`${timestamp}:DOWNLOADING ${ytVideoUrl}\n`);
  downloadYtVideo(ytVideoUrl, playlists);
  res.statusCode = 200;
  res.setHeader('Access-Control-Allow-Origin', 'https://www.youtube.com');
  res.end();
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
