import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import LoadingScreen from "../load";
import request from "request";

export default function ({
  navigation,
  route: {
    params: { colors, refreshToken, playlist },
  },
}) {
  const [tracks, setTracks] = useState();

  useEffect(() => {
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
            url: playlist.tracks,
            headers: { Authorization: "Bearer " + body.access_token },
            json: true,
          },
          (error, response, body) => {
            setTracks(body.items);
          }
        );
      }
    );
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

  if (!tracks) return <LoadingScreen colors={colors} />;

  console.log(tracks);

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
          gridTemplateColumns: "auto auto auto",
          alignItems: "center",
          gap: "1vw",
        }}
      >
        <View
          style={{
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
          <Pressable
            onPress={() =>
              navigation.navigate("Home", {
                refreshToken: refreshToken,
                colors: colors,
              })
            }
          >
            <AntDesign name="leftcircle" size={48} color={colors.primary} />
          </Pressable>
        </View>
        <Image
          source={playlist.image}
          style={{
            width: 200,
            height: 200,
            borderRadius: 5,
          }}
        />
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: "300%",
              fontWeight: "bold",
              color: colors.primary,
              textAlign: "center",
              padding: 10,
            }}
          >
            {playlist.name}
          </Text>
          <Pressable onPress={() => addToQueue()}>
            <AntDesign name="play" size={48} color={colors.primary} />
          </Pressable>
        </View>
      </View>
      {tracks.map(({ track: { name, artists } }, index) => {
        return (
          <View
            key={index}
            style={{
              display: "grid",
              gridTemplateColumns: "auto auto",
              width: "80vw",
              padding: 10,
              borderRadius: 5,
              backgroundColor: colors.default,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: "1vw",
                flexWrap: "wrap",
              }}
            >
              <Text
                style={{
                  color: colors.background,
                  fontWeight: "bold",
                }}
              >
                {name}
              </Text>
              <Text
                key={index}
                style={{
                  color: colors.secondary,
                  fontWeight: "500",
                }}
              >
                {artists.map(({ name }, index) => name).join(", ")}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: "1vw",
              }}
            >
              <Pressable>
                <AntDesign
                  name="pluscircle"
                  size={24}
                  color={colors.secondary}
                />
              </Pressable>

              <Pressable onPress={() => addToQueueStartingFromSong(index)}>
                <AntDesign name="play" size={24} color={colors.secondary} />
              </Pressable>
            </View>
          </View>
        );
      })}
    </View>
  );
}
