import { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

import request from "request";
import { useToken } from "../functions";

import Header from "../header";
import Sorter from "../sorter";
import Icon from "./icon";
import { getThemes } from "../colors";

const sortKeys = {
  Author: (a, b) => {
    const A = a.owner.display_name.toLowerCase();
    const B = b.owner.display_name.toLowerCase();

    if (A > B) return 1;
    if (A < B) return -1;

    return sortKeys.Name(a, b);
  },
  Name: (a, b) => {
    const A = a.name.toLowerCase();
    const B = b.name.toLowerCase();

    if (A > B) return 1;
    if (A < B) return -1;

    return 0;
  },
  Size: (a, b) => {
    const A = a.tracks.total;
    const B = b.tracks.total;

    return B - A;
  },
};

export default function Home({ theme, setTheme, colors, navigation, mobile }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [sortKey, setSortKey] = useState(
    localStorage.playlistSortKey || "Name"
  );
  const [reversed, setReversed] = useState(false);

  const [filter, setFilter] = useState("");

  const filteredPlaylists = useMemo(
    () =>
      playlists.filter(
        (value) =>
          value.name.toLowerCase().includes(filter.toLowerCase()) ||
          value.owner.display_name.toLowerCase().includes(filter.toLowerCase())
      ),
    [playlists, filter]
  );

  function appendPlaylists(body, accessToken, tempList) {
    tempList = [...tempList, ...body.items];

    if (body.next) {
      request.get(
        {
          url: body.next,
          headers: { Authorization: "Bearer " + accessToken },
          json: true,
        },
        (error, response, body) => {
          appendPlaylists(body, accessToken, tempList);
        }
      );
    } else {
      setLoading(false);

      setPlaylists((prev) => {
        if (reversed) return tempList.sort((a, b) => sortKeys[sortKey](b, a));
        return tempList.sort((a, b) => sortKeys[sortKey](a, b));
      });
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
          appendPlaylists(body, accessToken, []);
        }
      );
    });
  }, []);

  useEffect(() => {
    localStorage.playlistSortKey = sortKey;
    setPlaylists((prev) => {
      const tempList = [...prev];

      if (reversed) return tempList.sort((a, b) => sortKeys[sortKey](b, a));
      return tempList.sort((a, b) => sortKeys[sortKey](a, b));
    });
  }, [sortKey]);

  useEffect(() => {
    setPlaylists((prev) => {
      const next = [...prev];
      return next.reverse();
    });
  }, [reversed]);

  function appendTracks(body, accessToken, tracks, deviceID) {
    tracks = [...tracks, ...body.items];

    if (body.next) {
      request.get(
        {
          url: body.next,
          headers: { Authorization: "Bearer " + accessToken },
          json: true,
        },
        (error, response, body) => {
          appendTracks(body, accessToken, tracks, deviceID);
        }
      );
    } else {
      function getShuffledArray(array) {
        const newArray = [];
        while (array.length) {
          const index = Math.floor(Math.random() * array.length);
          newArray.push(array.splice(index, 1)[0]);
        }
        return newArray;
      }

      tracks = getShuffledArray(tracks);

      const query = new URLSearchParams({
        uri: tracks.pop().track.uri,
        device_id: deviceID,
      });

      request.post(
        {
          url: "https://api.spotify.com/v1/me/player/queue?" + query.toString(),
          headers: { Authorization: "Bearer " + accessToken },
          json: true,
        },
        (error, response, body) => {
          if (body) {
            console.log("request: add first track to queue", body);
            return;
          }
          const query = new URLSearchParams({
            device_id: deviceID,
          });
          request.post(
            {
              url:
                "https://api.spotify.com/v1/me/player/next?" + query.toString(),
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
                  uri: track.track.uri,
                  device_id: deviceID,
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
  }

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
          const deviceID = body.device.id;

          request.get(
            {
              url: href,
              headers: { Authorization: "Bearer " + accessToken },
              json: true,
            },
            (error, response, body) => {
              appendTracks(body, accessToken, [], deviceID);
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
        backgroundColor: colors.background,
      }}
    >
      <Header colors={colors}>
        <View
          style={{
            position: "absolute",
            alignSelf: "flex-start",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View>
            <Pressable
              onPress={() => {
                setOpen((prev) => !prev);
              }}
            >
              {open ? (
                <AntDesign name="up" size={60} color={colors.secondary} />
              ) : (
                <AntDesign name="down" size={60} color={colors.secondary} />
              )}
            </Pressable>

            <View
              style={{
                flexDirection: "row",
                height: 60,
                paddingHorizontal: 5,
                gap: 5,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.primary,
                position: "absolute",
                zIndex: -1,
                borderRadius: 20,
                transition: "top 200ms ease-in-out",
                top: open ? 70 : 0,
              }}
            >
              <Pressable
                disabled={!open}
                onPress={() => {
                  localStorage.removeItem("refresh_token");
                  navigation.navigate("Start");
                }}
              >
                <AntDesign
                  name="back"
                  size={50}
                  color={colors.secondary}
                  style={{
                    transition: open
                      ? "opacity 100ms linear 150ms"
                      : "opacity 100ms linear 50ms",
                    opacity: open ? 1 : 0,
                  }}
                />
              </Pressable>
              {getThemes()
                .filter(([name, _]) => name != theme)
                .map(([name, theme]) => (
                  <Pressable
                    disabled={!open}
                    key={name}
                    onPress={() => {
                      if (open) setTheme(name);
                    }}
                    style={{
                      transition: open
                        ? "opacity 100ms linear 150ms"
                        : "opacity 100ms linear 50ms",
                      opacity: open ? 1 : 0,
                      cursor: open ? "pointer" : "default",
                    }}
                  >
                    <View
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 50,
                        backgroundColor: theme.primary,
                      }}
                    />
                  </Pressable>
                ))}
            </View>
          </View>
        </View>
        <Image
          source={require("../../assets/icon.png")}
          style={{
            position: "absolute",
            alignSelf: "flex-end",
            width: 50,
            height: 50,
          }}
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: colors.secondary,
            textAlign: "center",
            zIndex: 1,
            marginHorizontal: 50,
          }}
        >
          Spotify Helper
        </Text>
      </Header>
      {mobile ? (
        <View
          style={{
            paddingVertical: 10,
            width: "100%",
            alignItems: "center",
            backgroundColor: colors.secondary,
            shadowOpacity: 0.3,
            zIndex: 1,
            shadowRadius: 15,
          }}
        >
          <TextInput
            value={filter}
            onChangeText={setFilter}
            placeholder="Search"
            style={{
              height: 30,
              width: 250,
              color: colors.accents,
              textAlign: "center",
              borderRadius: 5,
              borderWidth: 2,
              borderColor: colors.accents,
            }}
          />
          <Sorter
            colors={colors}
            sortKey={sortKey}
            setSortKey={setSortKey}
            keys={sortKeys}
            reversed={reversed}
            setReversed={setReversed}
          />
        </View>
      ) : (
        <View
          style={{
            paddingVertical: 10,
            width: "100%",
            zIndex: 1,
            gap: 10,
            flexDirection: "row",
            justifyContent: "center",
            backgroundColor: colors.secondary,
            shadowOpacity: 0.3,
            shadowRadius: 15,
          }}
        >
          <TextInput
            value={filter}
            onChangeText={setFilter}
            placeholder="Search"
            style={{
              height: 30,
              width: 250,
              color: colors.accents,
              textAlign: "center",
              borderRadius: 5,
              borderWidth: 2,
              borderColor: colors.accents,
            }}
          />
          <Sorter
            colors={colors}
            sortKey={sortKey}
            setSortKey={setSortKey}
            keys={sortKeys}
            reversed={reversed}
            setReversed={setReversed}
          />
        </View>
      )}
      <View
        style={{
          width: "100%",
          flex: 1,
          flexWrap: "wrap",
          flexDirection: "row",
          overflowY: "scroll",
          justifyContent: "center",
          paddingVertical: 15,
          gap: 15,
        }}
      >
        {loading ||
          filteredPlaylists.map((playlist) => (
            <Icon
              mobile={mobile}
              colors={colors}
              key={playlist.id}
              name={playlist.name}
              author={playlist.owner.display_name}
              image={playlist.images.length ? playlist.images[0].url : null}
              addToQueue={() => addToQueue(playlist.tracks.href)}
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
