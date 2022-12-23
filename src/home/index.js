import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import request from "request";
import LoadingScreen from "../load";
import Icon from "./components/icon";

export default function ({
  navigation,
  route: {
    params: { colors, refreshToken },
  },
}) {
  const [playlists, setPlaylists] = useState();

  useEffect(() => {
    // get playlists
    request.post(
      {
        url: "https://accounts.spotify.com/api/token",
        form: {
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        },
        headers: {
          Authorization:
            "Basic ZWQxMjMyODcxMTMzNDVjNDkzMzhkMWNmMjBiZWM5MGU6NjE2Mzg1ZjJlYzNkNGQ2M2E3OWJkMWIxZGZhM2M4MGM=",
        },
        json: true,
      },
      (error, response, body) => {
        request.get(
          {
            url: "https://api.spotify.com/v1/me/playlists",
            headers: { Authorization: "Bearer " + body.access_token },
            json: true,
          },
          (error, response, body) => {
            setPlaylists(
              body.items.map((playlist) => ({
                id: playlist.id,
                name: playlist.name,
                tracks: playlist.tracks.href,
                image:
                  playlist.images.length === 0 ? null : playlist.images[0].url,
              }))
            );
          }
        );
      }
    );
  }, []);

  function addToQueue(href) {
    request.post(
      {
        url: "https://accounts.spotify.com/api/token",
        form: {
          refresh_token: refreshToken,
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

            request.get(
              {
                url: href,
                headers: { Authorization: "Bearer " + access_token },
                json: true,
              },
              (error, response, body) => {
                function get_shuffled_array(array) {
                  const newArray = [];
                  while (array.length) {
                    const index = Math.floor(Math.random() * array.length);
                    newArray.push(array.splice(index, 1)[0]);
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
                    if (body) {
                      console.log("request: add first track to queue", body);
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
                        if (body) {
                          console.log("request: skip track", body);
                          return;
                        }
                        tracks.forEach((track) => {
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

  if (!playlists) return <LoadingScreen colors={colors} />;

  return (
    <View
      style={{
        width: "100%",
        minHeight: "100%",
        alignItems: "center",
        backgroundColor: colors.background,
        gap: 20,
      }}
    >
      <Text
        style={{
          fontSize: "300%",
          fontWeight: "bold",
          color: colors.primary,
          textAlign: "center",
          padding: 10,
        }}
      >
        Adiciona Playlist Embaralhada Para Fila
      </Text>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          padding: 10,
          gap: 5,
        }}
      >
        {playlists.map((playlist) => (
          <Icon
            key={playlist.id}
            playlist={playlist}
            addToQueue={() => addToQueue(playlist.tracks)}
            open={() =>
              navigation.navigate("Playlist", {
                playlist: playlist,
                refreshToken: refreshToken,
                colors: colors,
              })
            }
            colors={colors}
          />
        ))}
      </View>
    </View>
  );
}
