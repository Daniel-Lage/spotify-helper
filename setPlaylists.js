const express = require("express");
const request = require("request");
const open = require("open");
const fs = require("fs");

const redirect_uri = "http://localhost:8888/callback";

const app = express();

app.get("/", (req, res) => {
  res.redirect(
    "https://accounts.spotify.com/authorize?response_type=code&client_id=ed123287113345c49338d1cf20bec90e&scope=user-read-playback-state+user-modify-playback-state&redirect_uri=http%3A%2F%2Flocalhost%3A8888%2Fcallback"
  );
});

app.get("/callback", (req, res) => {
  const code = req.query.code || null;

  request.post(
    {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization:
          "Basic ZWQxMjMyODcxMTMzNDVjNDkzMzhkMWNmMjBiZWM5MGU6NjE2Mzg1ZjJlYzNkNGQ2M2E3OWJkMWIxZGZhM2M4MGM=",
      },
      json: true,
    },
    (error, response, body) => {
      const token = body.access_token;

      request.get(
        {
          url: "https://api.spotify.com/v1/me/playlists",
          headers: { Authorization: "Bearer " + token },
          json: true,
        },
        (error, response, body) => {
          const playlists = body.items.map((playlist) => ({
            name: playlist.name,
            tracks: playlist.tracks.href,
          }));

          fs.writeFileSync("playlists.json", JSON.stringify(playlists));
          process.exit();
        }
      );
    }
  );
  res.write("<script>window.close();</script>");
});

app.listen(8888);
open("http://localhost:8888/");
