import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { useToken } from "../components/functions";
import request from "request";
import LoadingScreen from "../load";
import Icon from "./components/icon";
import colors from "../components/colors";

export default function Home({ navigation }) {
  const [playlists, setPlaylists] = useState([]);

  function appendPlaylists(body, accessToken) {
    setPlaylists((prev) => [
      ...prev,
      ...body.items.map((playlist) => ({
        id: playlist.id,
        name: playlist.name,
        tracks: playlist.tracks.href,
        image: playlist.images.length === 0 ? null : playlist.images[0].url,
      })),
    ]);

    if (body.next) {
      request.get(
        {
          url: body.next,
          headers: { Authorization: "Bearer " + accessToken },
          json: true,
        },
        (error, response, body) => {
          appendPlaylists(body, accessToken);
        }
      );
    }
  }

  useEffect(() => {
    useToken((accessToken) => {
      request.get(
        {
          url: "https://api.spotify.com/v1/me/playlists",
          headers: { Authorization: "Bearer " + accessToken },
          json: true,
        },
        (error, response, body) => {
          appendPlaylists(body, accessToken);
        }
      );
    });
  }, []);

  function addToQueue(href) {
    useToken((accessToken) => {
      request.get(
        {
          url: "https://api.spotify.com/v1/me/player",
          headers: { Authorization: "Bearer " + accessToken },
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
              headers: { Authorization: "Bearer " + accessToken },
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
                  headers: { Authorization: "Bearer " + accessToken },
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
                        Authorization: "Bearer " + accessToken,
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
                            Authorization: "Bearer " + accessToken,
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
    });
  }

  if (!playlists) return <LoadingScreen />;

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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: 10,
        }}
      >
        <Image
          source={require("../../assets/icon.png")}
          style={{
            width: 100,
            height: 100,
          }}
        />
        <Text
          style={{
            fontSize: "300%",
            fontWeight: "bold",
            color: colors.primary,
            textAlign: "center",
          }}
        >
          Spotify Helper
        </Text>
      </View>
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
            onPress={() =>
              navigation.navigate("Playlist", {
                playlist: playlist,
              })
            }
          />
        ))}
      </View>
    </View>
  );
}
