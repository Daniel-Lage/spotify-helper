import { useEffect, useRef, useState } from "react";
import { Image, Text, View } from "react-native";
import { useToken } from "../../src/functions";
import request from "request";
import Button from "../components/button";
import Track from "./components/track";
import Colors from "../colors";
import Load from "../load";

export default function Playlist({
  navigation,
  route: {
    params: { playlist },
  },
}) {
  const theme = localStorage.getItem("theme");
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const colors = Colors(theme);
  const header = useRef();

  function appendTracks(body, accessToken, tempList) {
    tempList = [...tempList, ...body.items];
    if (body.next) {
      request.get(
        {
          url: body.next,
          headers: { Authorization: "Bearer " + accessToken },
          json: true,
        },
        (error, response, body) => {
          appendTracks(body, accessToken, tempList);
        }
      );
    } else {
      setLoading(false);
      setTracks(tempList);
    }
  }

  useEffect(() => {
    navigation.setOptions({ title: "Spotify Helper - " + playlist.name });
    useToken((accessToken) => {
      request.get(
        {
          url: playlist.tracks.href,
          headers: { Authorization: "Bearer " + accessToken },
          json: true,
        },
        (error, response, body) => {
          console.log("request: get initial tracks (1:100)", body);
          appendTracks(body, accessToken, []);
        }
      );
    });
  }, []);

  function addToQueue() {
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
    });
  }

  function addToQueueStartingFromSong(index) {
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
    });
  }

  return (
    <View
      style={{
        width: "100%",
        minHeight: "100%",
        alignItems: "center",
        backgroundColor: colors.background,
        gap: 10,
      }}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.primary,
          width: "100%",
          position: "fixed",
          padding: 10,
          zIndex: 101010,
          borderBottomWidth: 10,
          borderColor: colors.background,
        }}
        ref={header}
      >
        <Button
          symbol="leftcircle"
          onPress={() => navigation.goBack()}
          size={64}
          style={{ position: "absolute", alignSelf: "flex-start" }}
          theme={theme}
        />

        <Text
          style={{
            marginHorizontal: 64,
            fontSize: "300%",
            fontWeight: "bold",
            color: colors.secondary,
            textAlign: "center",
          }}
        >
          {playlist.name}
        </Text>
        <Image
          source={require("../../assets/icon.png")}
          style={{
            position: "absolute",
            alignSelf: "flex-end",
            width: 72,
            height: 72,
          }}
        />
      </View>
      {loading ? (
        <Load theme={theme} />
      ) : (
        <>
          <View
            style={{
              display: "grid",
              width: "100%",
              gridTemplateColumns: "auto auto",
              marginTop: header.current.clientHeight + 20,
              alignItems: "center",
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={playlist.images.length ? playlist.images[0].url : null}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 5,
                }}
              />
            </View>
            <View style={{ alignItems: "center" }}>
              <Button
                onPress={() => addToQueue()}
                style={{ height: "100%" }}
                symbol="play"
                size={120}
                theme={theme}
              />
            </View>
          </View>
          <Text style={{ color: colors.secondary, fontWeight: "bold" }}>
            {tracks.length} songs
          </Text>
          <View style={{ gap: 10, marginBottom: 10 }}>
            {tracks.map(({ track }, index) => (
              <Track
                track={track}
                key={index}
                index={index}
                onPress={() => addToQueueStartingFromSong(index)}
                theme={theme}
              />
            ))}
          </View>
        </>
      )}
    </View>
  );
}
