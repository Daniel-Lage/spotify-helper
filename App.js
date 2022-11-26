import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import request from "request";
import Icon from "./src/icon";

var refresh_token;
var auth_code;

export default function App() {
  const [playlists, setPlaylists] = useState([]);
  const params = new URLSearchParams(window.location.search);

  if (!params.get("code")) {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: "ed123287113345c49338d1cf20bec90e",
      scope:
        "user-read-playback-state user-modify-playback-state user-read-private user-read-email playlist-modify-public playlist-modify-private",
      redirect_uri: window.location.origin,
    });
    window.location.assign(
      "https://accounts.spotify.com/authorize?" + params.toString()
    );
    return;
  } else {
    auth_code = params.get("code");
  }

  console.log(auth_code);

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
        const access_token = body.access_token;
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
                    image:
                      playlist.images.length === 0
                        ? null
                        : playlist.images[0].url,
                  }))
                );
              }
            );
          }
        );
      }
    );
    return;
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
            console.log(body);
            const is_playing = body.is_playing;

            request.get(
              {
                url: href,
                headers: { Authorization: "Bearer " + access_token },
                json: true,
              },
              (error, response, body) => {
                function get_shuffled_array(array) {
                  const newArray = [];
                  for (var x = array.length - 1; x > -1; x--) {
                    const index = Math.floor(Math.random() * x);
                    newArray.push(array[index]);
                    array.splice(index, 1);
                  }
                  return newArray;
                }

                const tracks = get_shuffled_array(
                  body.items.map((value) => value.track)
                );

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
                  (error, response, body) => {
                    if (body.error) {
                      console.log(body);
                      return;
                    }
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
                      (error, response, body) => {
                        if (body.error) {
                          console.log(body);
                          return;
                        }
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
                            (error, response, body) => {
                              if (body.error) {
                                console.log(body);
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

  function createShuffledPlaylist(href) {
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
          "https://api.spotify.com/v1/me",
          {
            headers: { Authorization: "Bearer " + access_token },
            json: true,
          },
          (error, response, body) => {
            const user_id = body.id;
            // error parsin json (n sei oq ta acotnecendo ) :D
            // const query = new URLSearchParams({
            //   name: "eu fiz isso",
            //   description: "eu fiz isso tambem",
            //   public: false,
            // });

            request.post(
              "https://api.spotify.com/v1/users/" + user_id + "/playlists",
              {
                body: JSON.stringify({
                  name: "eu fiz isso",
                  description: "eu fiz isso tambem",
                  public: false,
                  collaborative: false,
                }),
                headers: {
                  Authorization: "Bearer " + access_token,
                  "Content-Type": "application/json",
                },
                json: true,
              },
              (error, response, body) => {
                console.log(body);
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
      <Button
        title="REFRESH"
        onPress={() => {
          window.location.assign(window.location.origin);
        }}
        color="#d6c05c"
      />
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
