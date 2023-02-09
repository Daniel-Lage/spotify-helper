import { useEffect, useState } from "react";
import { Dimensions, Image, Pressable, Text, View } from "react-native";
import { useToken } from "../../src/functions";
import request from "request";
import PlayButton from "../components/playbutton";
import Track from "./components/track";
import Header from "../components/header";
import { AntDesign } from "@expo/vector-icons";

const { height, width } = Dimensions.get("window");
const aspectRatio = height / width;

export default function Playlist({
  colors,
  navigation,
  route: {
    params: { playlist },
  },
}) {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

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
  console.log(playlist);
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
      <Header colors={colors}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{ position: "absolute", alignSelf: "flex-start" }}
        >
          <AntDesign name="caretleft" size={"9vh"} color={colors.secondary} />
        </Pressable>

        <Text
          numberOfLines={2}
          style={{
            fontSize: "3vh",
            fontWeight: "bold",
            color: colors.secondary,
            textAlign: "center",
            marginHorizontal: 64,
          }}
        >
          {playlist.name}
        </Text>
        <Image
          source={require("../../assets/icon.png")}
          style={{
            position: "absolute",
            alignSelf: "flex-end",
            width: "9vh",
            height: "9vh",
          }}
        />
      </Header>
      {aspectRatio > 1.6 ? (
        <>
          <View
            style={{
              backgroundColor: colors.dark_item,
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              flexDirection: "column",
              paddingBottom: "2vh",
              shadowOpacity: 0.5,
              shadowRadius: 15,
            }}
          >
            <View
              style={{
                paddingTop: "12vh",
                alignItems: "flex-end",
                justifyContent: "flex-end",
              }}
            >
              <Image
                source={playlist.images.length ? playlist.images[0].url : null}
                style={{
                  width: "80vw",
                  height: "80vw",
                  borderRadius: 5,
                }}
              />
              <PlayButton
                onPress={() => addToQueue()}
                style={{
                  marginBottom: "12vw",
                  marginRight: "12vw",
                  position: "absolute",
                }}
                size={20}
                colors={colors}
              />
            </View>
            <View
              style={{
                marginTop: "1.5vh",
                width: "80vw",
              }}
            >
              <Text
                style={{
                  color: colors.primary,
                  fontWeight: "bold",
                }}
              >
                by {playlist.owner.display_name}
              </Text>
              <Text
                style={{
                  color: colors.secondary,
                  fontWeight: "bold",
                }}
              >
                {playlist.tracks.total} songs
              </Text>
            </View>
          </View>
          <View style={{ gap: 10, marginBottom: 10 }}>
            {loading ||
              tracks.map(({ track }, index) => (
                <Track
                  track={track}
                  key={index}
                  index={index}
                  onPress={() => addToQueueStartingFromSong(index)}
                  colors={colors}
                />
              ))}
          </View>
        </>
      ) : (
        <>
          <View
            style={{
              backgroundColor: colors.dark_item,
              justifyContent: "flex-start",
              alignItems: "flex-start",
              width: "100%",
              paddingHorizontal: "10vw",
              paddingBottom: "2vh",
              paddingTop: "12vh",
              flexDirection: "row",
              shadowOpacity: 0.5,
              shadowRadius: 15,
            }}
          >
            <View
              style={{
                alignItems: "flex-end",
                justifyContent: "flex-end",
              }}
            >
              <Image
                source={playlist.images.length ? playlist.images[0].url : null}
                style={{
                  width: "25vw",
                  height: "25vw",
                  borderRadius: 5,
                }}
              />
              <PlayButton
                onPress={() => addToQueue()}
                style={{
                  position: "absolute",
                  marginBottom: "3.75vw",
                  marginRight: "3.75vw",
                }}
                size={5}
                colors={colors}
              />
            </View>
            <View
              style={{
                paddingLeft: "26vw",
                position: "absolute",
              }}
            >
              <Text
                style={{
                  color: colors.primary,
                  fontWeight: "bold",
                }}
              >
                by {playlist.owner.display_name}
              </Text>
              <Text
                style={{
                  color: colors.secondary,
                  fontWeight: "bold",
                }}
              >
                {playlist.tracks.total} songs
              </Text>
            </View>
          </View>
          <View style={{ gap: 10, marginBottom: 10 }}>
            {loading ||
              tracks.map(({ track }, index) => (
                <Track
                  track={track}
                  key={index}
                  index={index}
                  onPress={() => addToQueueStartingFromSong(index)}
                  colors={colors}
                />
              ))}
          </View>
        </>
      )}
    </View>
  );
}
