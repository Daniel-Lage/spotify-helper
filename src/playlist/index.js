import { useEffect, useState } from "react";
import { Dimensions, Image, Pressable, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

import request from "request";

import { useToken } from "../../src/functions";
import Cover from "../components/cover";
import Header from "../components/header";
import Track from "./components/track";
import Sorter from "../components/sorter";

const { height, width } = Dimensions.get("window");
const aspectRatio = height / width;
const mobile = aspectRatio > 1.6;

const sortKeys = {
  Name: ["track", "name"],
  Artist: ["track", "artists", 0, "name"],
  Album: ["track", "album", "name"],
  "Added At": ["added_at"],
};

export default function Playlist({
  colors,
  navigation,
  route: {
    params: { playlist },
  },
}) {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [sortKey, setSortKey] = useState(
    localStorage.getItem("track-sort-key") || "Added At"
  );
  const [sortOrder, setSortOrder] = useState(1);

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
      setTracks(
        tempList.sort((a, b) => {
          sortKeys[sortKey].forEach((index) => {
            a = a[index];
            b = b[index];
          });
          if (a.toLowerCase() > b.toLowerCase()) return sortOrder;
          if (a.toLowerCase() < b.toLowerCase()) return -sortOrder;
          return 0;
        })
      );
    }
  }

  useEffect(() => {
    localStorage.setItem("track-sort-key", sortKey);
    setTracks((prev) => {
      const tempList = [...prev];
      return tempList.sort((a, b) => {
        sortKeys[sortKey].forEach((index) => {
          console.log(a, b);
          a = a[index];
          b = b[index];
        });
        if (a.toLowerCase() > b.toLowerCase()) return sortOrder;
        if (a.toLowerCase() < b.toLowerCase()) return -sortOrder;
        return 0;
      });
    });
  }, [sortKey]);

  useEffect(() => {
    setTracks((prev) => {
      const next = [...prev];
      return next.reverse();
    });
  }, [sortOrder]);

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
        height: "100%",
        alignItems: "center",
      }}
    >
      <Header colors={colors}>
        <Pressable
          onPress={() => navigation.navigate("Home")}
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
          Spotify Helper
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
      {mobile ? (
        <View
          style={{
            width: "100%",
            flex: 1,
            overflowY: "scroll",
            backgroundColor: colors.background,
          }}
        >
          <View
            style={{
              backgroundColor: colors.dark_item,
              alignItems: "center",
              justifyContent: "center",
              height: "94vw",
              width: "100%",
              shadowOpacity: 0.3,
              shadowRadius: 15,
            }}
          >
            <Cover
              image={playlist.images.length ? playlist.images[0].url : null}
              colors={colors}
              size={50}
            />
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
                {playlist.name}
              </Text>
              <Text
                style={{
                  color: colors.secondary,
                  fontWeight: "bold",
                }}
              >
                {playlist.description}
              </Text>
              <Text
                style={{
                  color: colors.primary,
                  fontWeight: "bold",
                }}
              >
                {playlist.owner.display_name}
              </Text>
              <Text
                style={{
                  color: colors.accents,
                }}
              >
                {playlist.tracks.total} songs
              </Text>
            </View>
          </View>
          <View
            style={{
              gap: "1vh",
              width: "100%",
              paddingVertical: "1vh",
              alignItems: "center",
            }}
          >
            {loading ||
              tracks.map((track, index) => (
                <Track
                  track={track}
                  key={index}
                  index={index}
                  onPress={() => addToQueueStartingFromSong(index)}
                  colors={colors}
                  mobile={mobile}
                />
              ))}
          </View>
        </View>
      ) : (
        <View
          style={{
            width: "100%",
            flex: 1,
            overflowY: "scroll",
            backgroundColor: colors.background,
          }}
        >
          <View
            style={{
              backgroundColor: colors.dark_item,
              alignItems: "center",
              justifyContent: "center",
              height: "50vh",
              width: "100%",
              shadowOpacity: 0.3,
              shadowRadius: 15,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: "1vh",
                width: "80vw",
              }}
            >
              <Cover
                image={playlist.images.length ? playlist.images[0].url : null}
                onPress={() => addToQueue()}
                colors={colors}
                size={24}
              />
              <View style={{ marginLeft: "1vw", gap: "1vh" }}>
                <Text
                  style={{
                    fontSize: "5vh",
                    color: colors.accents,
                    fontWeight: "bold",
                  }}
                >
                  {playlist.name}
                </Text>
                <Text
                  style={{
                    fontSize: "2vh",
                    color: colors.secondary,
                    fontWeight: "bold",
                  }}
                >
                  {playlist.description}
                </Text>
                <Text
                  style={{
                    fontSize: "3vh",
                    color: colors.primary,
                  }}
                >
                  {playlist.owner.display_name}
                </Text>
                <Text
                  style={{
                    fontSize: "2vh",
                    color: colors.accents,
                  }}
                >
                  {playlist.tracks.total} songs
                </Text>
                <Sorter
                  colors={colors}
                  sortKey={sortKey}
                  setSortKey={setSortKey}
                  keys={sortKeys}
                  sortOrder={sortOrder}
                  setSortOrder={setSortOrder}
                />
              </View>
            </View>
          </View>
          <View
            style={{
              gap: "1vh",
              width: "100%",
              paddingVertical: "1vh",
              alignItems: "center",
            }}
          >
            {loading ||
              tracks.map((track, index) => (
                <Track
                  track={track}
                  key={index}
                  index={index}
                  onPress={() => addToQueueStartingFromSong(index)}
                  colors={colors}
                  mobile={mobile}
                />
              ))}
          </View>
        </View>
      )}
    </View>
  );
}
