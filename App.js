import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import request from "request";

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
  } else if (!access_token) {
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
        if (body.access_token) {
          access_token = body.access_token;
          refresh_token = body.refresh_token;

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
                      name: playlist.name,
                      tracks: playlist.tracks.href,
                      image: (
                        <Image
                          source={playlist.images[0].url}
                          style={{
                            width: 100,
                            height: 100,
                            margin: 10,
                            border: "2px solid #d6c05c",
                            borderRadius: 5,
                          }}
                        />
                      ),
                    }))
                  );
                }
              );
            }
          );
        } else {
          const params = new URLSearchParams({
            response_type: "code",
            client_id: "ed123287113345c49338d1cf20bec90e",
            scope: "user-read-playback-state user-modify-playback-state",
            redirect_uri: window.location.origin,
          });
          window.location.assign(
            "https://accounts.spotify.com/authorize?" + params.toString()
          );
        }
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
            if (body) {
              const device_id = body.device.id;
              const is_playing = body.is_playing;

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
                          headers: { Authorization: "Bearer " + access_token },
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
                          } else {
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
                        }
                      );
                    }
                  );
                }
              );
            }
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
        {playlists.map((playlist, index) => (
          <Pressable
            key={playlist.name}
            style={styles.button}
            onPress={() => addToQueue(playlist.tracks)}
          >
            {playlist.image}
            <Text
              style={{
                height: "100%",
                width: "100%",
                textAlign: "center",
                fontSize: 15,
                color: "#d6c05c",
                fontWeight: "bold",
              }}
            >
              {playlist.name}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text
        style={{
          margin: 20,
          fontSize: "100%",
          fontWeight: "bold",
          color: "#74a1e8",
          textAlign: "center",
        }}
      >
        spotify tem que estar aberto para adicionar uma playlist na fila (pode
        ser em outro dispositivo)
      </Text>
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
  button: {
    width: 120,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});
