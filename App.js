import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import request from "request";
import Icon from "./src/icon";

var access_token;
var refresh_token;

export default function App() {
  const [playlists, setPlaylists] = useState([]);
  const params = new URLSearchParams(window.location.search);

  var auth_code = params.get("code");

  if (!auth_code) {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: "ed123287113345c49338d1cf20bec90e",
      scope: "user-read-playback-state user-modify-playback-state",
      redirect_uri: window.location.origin,
    });
    window.location.assign(
      "https://accounts.spotify.com/authorize?" + params.toString()
    );
    return;
  }

  if (!refresh_token) {
    // get refresh token
    request.post(
      {
        url: "https://accounts.spotify.com/api/token",
        form: {
          code: auth_code,
          redirect_uri: window.location.origin,
          grant_type: "authorization_code",
        },
        headers: {
          Authorization:
            "Basic ZWQxMjMyODcxMTMzNDVjNDkzMzhkMWNmMjBiZWM5MGU6NjE2Mzg1ZjJlYzNkNGQ2M2E3OWJkMWIxZGZhM2M4MGM=",
        },
        json: true,
      },
      (error, response, body) => {
        if (!body.access_token) {
          const params = new URLSearchParams({
            response_type: "code",
            client_id: "ed123287113345c49338d1cf20bec90e",
            scope: "user-read-playback-state user-modify-playback-state",
            redirect_uri: window.location.origin,
          });
          window.location.assign(
            "https://accounts.spotify.com/authorize?" + params.toString()
          );
          return;
        }
        access_token = body.access_token;
        refresh_token = body.refresh_token;
        // get playlists
        request.post(
          {
            url: "https://accounts.spotify.com/api/token",
            form: {
              refresh_token: refresh_token,
              grant_type: "refresh_token",
            },
            headers: {
              Authorization:
                "Basic ZWQxMjMyODcxMTMzNDVjNDkzMzhkMWNmMjBiZWM5MGU6NjE2Mzg1ZjJlYzNkNGQ2M2E3OWJkMWIxZGZhM2M4MGM=",
            },
            json: true,
          },
          (error, response, body) => {
            const access_token = body.access_token;
            request.get(
              {
                url: "https://api.spotify.com/v1/me/playlists",
                headers: { Authorization: "Bearer " + access_token },
                json: true,
              },
              (error, response, body) => {
                setPlaylists(
                  body.items.map((playlist) => ({
                    id: playlist.id,
                    name: playlist.name,
                    tracks: playlist.tracks.href,
                    image: playlist.images[0].url,
                  }))
                );
              }
            );
          }
        );
      }
    );
  }

  function addToQueue(href) {
    request.post(
      {
        url: "https://accounts.spotify.com/api/token",
        form: {
          refresh_token: refresh_token,
          grant_type: "refresh_token",
        },
        headers: {
          Authorization:
            "Basic ZWQxMjMyODcxMTMzNDVjNDkzMzhkMWNmMjBiZWM5MGU6NjE2Mzg1ZjJlYzNkNGQ2M2E3OWJkMWIxZGZhM2M4MGM=",
        },
        json: true,
      },
      (error, response, body) => {
        const access_token = body.access_token;
        request.get(
          {
            url: "https://api.spotify.com/v1/me/player",
            headers: { Authorization: "Bearer " + access_token },
            json: true,
          },
          (error, response, body) => {
            if (!body) {
              alert(
                "spotify não esta aberto (toque uma musica para ativar o dispositivo)"
              );
              return;
            }
            const device_id = body.device.id;
            const is_playing = body.is_playing;
            request.get(
              {
                url: "https://api.spotify.com/v1/me/player/queue",
                headers: { Authorization: "Bearer " + access_token },
                json: true,
              },
              (error, response, body) => {
                if (body.queue.length > 1) {
                  console.log(body);
                  if (
                    !body.queue.every(
                      (track) => track.id == body.currently_playing.id // when you add single songs on spotify for android it adds 10 versions of it in the queue :) i totally dont want to kill
                    )
                  ) {
                    alert(
                      "você ja tem musicas na fila (se não tiver musicas na fila pesquise uma musica e toque ela)"
                    );
                    return;
                  }
                }
                request.get(
                  {
                    url: href,
                    headers: { Authorization: "Bearer " + access_token },
                    json: true,
                  },
                  (error, response, body) => {
                    function shuffle(array) {
                      var currentIndex = array.length,
                        randomIndex;

                      // While there remain elements to shuffle.
                      while (currentIndex != 0) {
                        // Pick a remaining element.
                        randomIndex = Math.floor(Math.random() * currentIndex);
                        currentIndex--;

                        // And swap it with the current element.
                        [array[currentIndex], array[randomIndex]] = [
                          array[randomIndex],
                          array[currentIndex],
                        ];
                      }
                    }
                    const tracks = body.items.map((value) => value.track);
                    shuffle(tracks);

                    const query = new URLSearchParams({
                      uri: tracks.pop().uri,
                      device_id: device_id,
                    });
                    request.post(
                      {
                        url:
                          "https://api.spotify.com/v1/me/player/queue?" +
                          query.toString(),
                        headers: { Authorization: "Bearer " + access_token },
                        json: true,
                      },
                      () => {
                        const query = new URLSearchParams({
                          device_id: device_id,
                        });
                        request.post(
                          {
                            url:
                              "https://api.spotify.com/v1/me/player/next?" +
                              query.toString(),
                            headers: {
                              Authorization: "Bearer " + access_token,
                            },
                            json: true,
                          },
                          () => {
                            if (!is_playing) {
                              const query = new URLSearchParams({
                                device_id: device_id,
                              });
                              request.put(
                                {
                                  url:
                                    "https://api.spotify.com/v1/me/player/play?" +
                                    query.toString(),
                                  headers: {
                                    Authorization: "Bearer " + access_token,
                                  },
                                  json: true,
                                },
                                () => {
                                  tracks.forEach((track, index) => {
                                    const query = new URLSearchParams({
                                      uri: track.uri,
                                      device_id: device_id,
                                    });
                                    request.post({
                                      url:
                                        "https://api.spotify.com/v1/me/player/queue?" +
                                        query.toString(),
                                      headers: {
                                        Authorization: "Bearer " + access_token,
                                      },
                                      json: true,
                                    });
                                  });
                                }
                              );
                              return;
                            }
                            tracks.forEach((track, index) => {
                              const query = new URLSearchParams({
                                uri: track.uri,
                                device_id: device_id,
                              });
                              request.post({
                                url:
                                  "https://api.spotify.com/v1/me/player/queue?" +
                                  query.toString(),
                                headers: {
                                  Authorization: "Bearer " + access_token,
                                },
                                json: true,
                              });
                            });
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  }

  return (
    <View style={styles.container}>
      <Text
        style={{
          margin: 20,
          fontSize: "300%",
          fontWeight: "bold",
          color: "#d6c05c",
          textAlign: "center",
        }}
      >
        Adiciona Playlist Embaralhada Para Fila
      </Text>
      <View style={styles.grid}>
        {playlists.map((playlist) => (
          <Icon key={playlist.id} playlist={playlist} onPress={addToQueue} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    backgroundColor: "#1a1c1f",
    gap: 10,
  },
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
});
