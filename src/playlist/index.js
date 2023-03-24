import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

import request from "request";

import { useToken } from "../functions";
import Cover from "../cover";
import Header from "../header";
import Track from "./track";
import Sorter from "../sorter";
import Filter from "../filter";

const sortKeys = {
  Artist: (a, b) => {
    const A = a.track.artists[0].name.toLowerCase();
    const B = b.track.artists[0].name.toLowerCase();

    if (A > B) return 1;
    if (A < B) return -1;

    return sortKeys.Album(a, b);
  },
  Album: (a, b) => {
    const A = a.track.album.name.toLowerCase();
    const B = b.track.album.name.toLowerCase();

    if (A > B) return 1;
    if (A < B) return -1;

    return b.track.disc_number - a.track.disc_number;
  },
  Name: (a, b) => {
    const A = a.track.name.toLowerCase();
    const B = b.track.name.toLowerCase();

    if (A > B) return 1;
    if (A < B) return -1;

    return sortKeys.Date(a, b);
  },
  Date: (a, b) => {
    const A = new Date(a.added_at);
    const B = new Date(b.added_at);

    return B.getTime() - A.getTime();
  },
};

export default function Playlist({
  colors,
  vertical,
  navigation,
  route: {
    params: { playlist },
  },
}) {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sortKey, setSortKey] = useState(localStorage.trackSortKey || "Date");
  const [reversed, setReversed] = useState(false);

  const [filter, setFilter] = useState("");

  const filteredTracks = useMemo(
    () =>
      tracks.filter(
        (value) =>
          value.track.name.toLowerCase().includes(filter.toLowerCase()) ||
          value.track.album.name.toLowerCase().includes(filter.toLowerCase()) ||
          value.track.artists.some((value) =>
            value.name.toLowerCase().includes(filter.toLowerCase())
          )
      ),
    [tracks, filter]
  );

  function appendTracks(next, items, accessToken, tempList) {
    tempList = [...tempList, ...items];

    if (next) {
      request.get(
        {
          url: next,
          headers: { Authorization: "Bearer " + accessToken },
          json: true,
        },
        (error, response, body) => {
          console.log(
            "request: get tracks",
            body.next
              ? `[${body.offset}:${body.offset + body.limit}]`
              : `[${body.offset}:${body.total}]`
          );

          appendTracks(body.next, body.items, accessToken, tempList);
        }
      );
    } else {
      setLoading(false);

      tempList = tempList.filter((value) => value.track);

      setTracks((prev) =>
        reversed
          ? tempList.sort((a, b) => sortKeys[sortKey](b, a))
          : tempList.sort((a, b) => sortKeys[sortKey](a, b))
      );
    }
  }

  useEffect(() => {
    navigation.setOptions({ title: playlist.name + " - Spotify Helper - " });

    useToken((accessToken) =>
      request.get(
        {
          url: playlist.tracks.href,
          headers: { Authorization: "Bearer " + accessToken },
          json: true,
        },
        (error, response, body) => {
          console.log(
            "request: get tracks",
            body.next
              ? `[${body.offset}:${body.offset + body.limit}]`
              : `[${body.offset}:${body.total}]`
          );

          appendTracks(body.next, body.items, accessToken, []);
        }
      )
    );
  }, []);

  useEffect(() => {
    localStorage.trackSortKey = sortKey;

    setTracks((prev) =>
      reversed
        ? [...prev].sort((a, b) => sortKeys[sortKey](b, a))
        : [...prev].sort((a, b) => sortKeys[sortKey](a, b))
    );
  }, [sortKey]);

  useEffect(() => {
    setTracks((prev) => [...prev].reverse());
  }, [reversed]);

  function addToQueue() {
    useToken((accessToken) => {
      request.get(
        {
          url: "https://api.spotify.com/v1/me/player",
          headers: { Authorization: "Bearer " + accessToken },
          json: true,
        },
        (error, response, body) => {
          console.log("request: get device id");

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
              console.log("request: add first track to queue");

              if (body) return console.error(body);

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
                  console.log("request: skip track");

                  if (body) return console.error(body);

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

  function addToQueueStartingFromTrack(track) {
    useToken((accessToken) =>
      request.get(
        {
          url: "https://api.spotify.com/v1/me/player",
          headers: { Authorization: "Bearer " + accessToken },
          json: true,
        },
        (error, response, body) => {
          console.log("request: get device id");

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
          const first_track = newTracks.splice(
            newTracks.findIndex((value) => value === track),
            1
          )[0].track;

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
              console.log("request: add first track to queue");

              if (body) return console.error(body);

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
                  console.log("request: skip track");

                  if (body) return console.error(body);

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
      )
    );
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
          <AntDesign name="caretleft" size={50} color={colors.secondary} />
        </Pressable>

        <Text
          style={{
            fontSize: vertical ? 26 : 40,
            fontWeight: "bold",
            color: colors.secondary,
            textAlign: "center",
            marginHorizontal: 50,
            fontFamily: "Gotham-Bold",
          }}
        >
          Spotify Helper
        </Text>
        <Image
          source={require("../../assets/icon.png")}
          style={{
            position: "absolute",
            alignSelf: "flex-end",
            width: 50,
            height: 50,
          }}
        />
      </Header>
      {vertical ? (
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
              minHeight: 300,
              paddingVertical: 20,
              width: "100%",
              shadowOpacity: 0.3,
              shadowRadius: 15,
              zIndex: 1,
            }}
          >
            <Cover
              image={playlist.images.length ? playlist.images[0].url : null}
              colors={colors}
              size={250}
            />
            <View
              style={{
                marginVertical: 10,
                width: 250,
              }}
            >
              <Text
                style={{
                  fontSize: vertical ? 26 : 40,
                  color: colors.accents,
                  fontFamily: "Roboto-Regular",
                  fontWeight: "bold",
                }}
              >
                {playlist.name}
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  color: colors.secondary,
                  fontFamily: "Roboto-Regular",
                }}
              >
                {playlist.description}
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  color: colors.primary,
                  fontFamily: "Roboto-Regular",
                  fontWeight: "bold",
                }}
              >
                {playlist.owner.display_name}
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  color: colors.accents,
                  fontFamily: "Roboto-Regular",
                }}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  tracks.length + " songs"
                )}
              </Text>
            </View>
            <Filter filter={filter} setFilter={setFilter} colors={colors} />
            <Sorter
              colors={colors}
              sortKey={sortKey}
              setSortKey={setSortKey}
              keys={sortKeys}
              reversed={reversed}
              setReversed={setReversed}
            />
          </View>
          <View
            style={{
              gap: 10,
              width: "100%",
              paddingVertical: 10,
              alignItems: "center",
            }}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              filteredTracks.map((track, index) => (
                <Track
                  track={track}
                  key={index}
                  index={index}
                  onPress={() => addToQueueStartingFromTrack(track)}
                  colors={colors}
                  vertical={vertical}
                />
              ))
            )}
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
              paddingVertical: 20,
              width: "100%",
              shadowOpacity: 0.3,
              zIndex: 1,
              shadowRadius: 15,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: 10,
              }}
            >
              <Cover
                image={playlist.images.length ? playlist.images[0].url : null}
                onPress={() => addToQueue()}
                colors={colors}
                size={250}
              />
              <View style={{ marginLeft: 10, gap: 10 }}>
                <Text
                  style={{
                    fontSize: vertical ? 26 : 40,
                    color: colors.accents,
                    fontFamily: "Roboto-Regular",
                    fontWeight: "bold",
                  }}
                >
                  {playlist.name}
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    color: colors.secondary,
                    fontFamily: "Roboto-Regular",
                  }}
                >
                  {playlist.description}
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    color: colors.primary,
                    fontFamily: "Roboto-Regular",
                    fontWeight: "bold",
                  }}
                >
                  {playlist.owner.display_name}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: colors.accents,
                    fontFamily: "Roboto-Regular",
                  }}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    tracks.length + " songs"
                  )}
                </Text>
                <Filter filter={filter} setFilter={setFilter} colors={colors} />
                <Sorter
                  colors={colors}
                  sortKey={sortKey}
                  setSortKey={setSortKey}
                  keys={sortKeys}
                  reversed={reversed}
                  setReversed={setReversed}
                />
              </View>
            </View>
          </View>
          <View
            style={{
              gap: 10,
              width: "100%",
              paddingVertical: 10,
              alignItems: "center",
            }}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              filteredTracks.map((track, index) => (
                <Track
                  track={track}
                  key={index}
                  index={index}
                  onPress={() => addToQueueStartingFromTrack(track)}
                  colors={colors}
                  vertical={vertical}
                />
              ))
            )}
          </View>
        </View>
      )}
    </View>
  );
}
