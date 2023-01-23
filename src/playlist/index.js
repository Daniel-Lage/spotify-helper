import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { useToken } from "../components/functions";
import LoadingScreen from "../load";
import request from "request";
import Button from "../components/button";
import Track from "./components/track";
import colors from "../components/colors";

export default function Playlist({
  navigation,
  route: {
    params: { refreshToken, playlist },
  },
}) {
  const [tracks, setTracks] = useState([]);

  function appendTracks(body, accessToken) {
    setTracks((prev) => {
      return [...prev, ...body.items];
    });

    if (body.next) {
      request.get(
        {
          url: body.next,
          headers: { Authorization: "Bearer " + accessToken },
          json: true,
        },
        (error, response, body) => {
          appendTracks(body, accessToken);
        }
      );
    }
  }

  useEffect(() => {
    useToken((accessToken) => {
      request.get(
        {
          url: playlist.tracks,
          headers: { Authorization: "Bearer " + accessToken },
          json: true,
        },
        (error, response, body) => {
          appendTracks(body, accessToken);
        }
      );
    });
  }, []);

  function addToQueue() {
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

            function get_shuffled_array(array) {
              const newArray = [];
              while (array.length) {
                const index = Math.floor(Math.random() * array.length);
                newArray.push(array.splice(index, 1)[0]);
              }
              return newArray;
            }

            const shuffledTracks = get_shuffled_array(
              tracks.map((value) => value.track)
            );

            const query = new URLSearchParams({
              uri: shuffledTracks.pop().uri,
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
                    shuffledTracks.forEach((track) => {
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

  function addToQueueStartingFromSong(index) {
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

            function get_shuffled_array(array) {
              const newArray = [];
              while (array.length) {
                const index = Math.floor(Math.random() * array.length);
                newArray.push(array.splice(index, 1)[0]);
              }
              return newArray;
            }

            const newTracks = [...tracks];
            const first_track = newTracks.splice(index, 1)[0].track;

            const shuffledTracks = get_shuffled_array(
              newTracks.map((value) => value.track)
            );
            shuffledTracks.slice;

            const query = new URLSearchParams({
              uri: first_track.uri,
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
                    shuffledTracks.forEach((track) => {
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

  if (!tracks) return <LoadingScreen />;

  return (
    <View
      style={{
        width: "100%",
        minHeight: "100%",
        alignItems: "center",
        backgroundColor: colors.background,
        padding: "3vh",
        gap: 20,
      }}
    >
      <View
        style={{
          display: "grid",
          width: "100%",
          gridTemplateColumns: "auto auto auto",
          alignItems: "center",
          gap: "1vw",
        }}
      >
        <Button
          onPress={() => navigation.navigate("Home")}
          style={{ height: "100%" }}
          symbol="leftcircle"
          size={50}
        />
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            padding: 10,
          }}
        >
          <Image
            source={playlist.image}
            style={{
              width: "20vw",
              height: "20vw",
              borderRadius: 5,
            }}
          />
        </View>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: "150%",
              fontWeight: "bold",
              color: colors.primary,
              textAlign: "center",
              padding: 10,
            }}
          >
            {playlist.name}
          </Text>
          <Button
            onPress={() => addToQueue()}
            style={{ height: "100%" }}
            symbol="play"
            size={50}
          />
        </View>
      </View>
      {tracks.map(({ track }, index) => (
        <Track
          track={track}
          key={index}
          index={index}
          onPress={() => addToQueueStartingFromSong(index)}
        />
      ))}
    </View>
  );
}
