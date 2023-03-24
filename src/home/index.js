import { useEffect, useMemo, useRef, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

import request from "request";
import { useToken } from "../functions";

import Header from "../header";
import Sorter from "../sorter";
import Icon from "./icon";
import { getThemes } from "../colors";
import Filter from "../filter";

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

export default function Home({
  theme,
  setTheme,
  colors,
  navigation,
  vertical,
}) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const content = useRef();

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

  function appendPlaylists(next, items, accessToken, tempList) {
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
            "request: get playlists",
            body.next
              ? `[${body.offset}:${body.offset + body.limit}]`
              : `[${body.offset}:${body.total}]`
          );

          appendPlaylists(body.next, body.items, accessToken, tempList);
        }
      );
    } else {
      setLoading(false);

      setPlaylists((prev) =>
        reversed
          ? tempList.sort((a, b) => sortKeys[sortKey](b, a))
          : tempList.sort((a, b) => sortKeys[sortKey](a, b))
      );
    }
  }

  useEffect(() => {
    window.addEventListener("click", (e) =>
      setOpen(content.current?.contains(e.target))
    );

    useToken((accessToken) =>
      request.get(
        {
          url: "https://api.spotify.com/v1/me/playlists",
          headers: { Authorization: "Bearer " + accessToken },
          json: true,
        },
        (error, response, body) => {
          console.log(
            "request: get playlists",
            body.next
              ? `[${body.offset}:${body.offset + body.limit}]`
              : `[${body.offset}:${body.total}]`
          );

          appendPlaylists(body.next, body.items, accessToken, []);
        }
      )
    );
  }, []);

  useEffect(() => {
    localStorage.playlistSortKey = sortKey;
    setPlaylists((prev) =>
      reversed
        ? [...prev].sort((a, b) => sortKeys[sortKey](b, a))
        : [...prev].sort((a, b) => sortKeys[sortKey](a, b))
    );
  }, [sortKey]);

  useEffect(() => {
    setPlaylists((prev) => [...prev].reverse());
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
        (error, response, body) =>
          appendTracks(body, accessToken, tracks, deviceID)
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
          console.log("request: add first track to queue");

          if (body) return console.error(body);

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
              console.log("request: skip track");

              if (body) return console.error(body);

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
    useToken((accessToken) =>
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
            (error, response, body) =>
              appendTracks(body, accessToken, [], deviceID)
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
        backgroundColor: colors.background,
      }}
    >
      <Header colors={colors}>
        <Pressable
          style={{
            position: "absolute",
            alignSelf: "flex-start",
          }}
          onPress={() => setOpen((prev) => !prev)}
        >
          <AntDesign name="ellipsis1" size={60} color={colors.secondary} />
        </Pressable>
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
            fontSize: vertical ? 26 : 40,
            fontWeight: "bold",
            color: colors.secondary,
            textAlign: "center",
            zIndex: 1,
            marginHorizontal: 50,
            fontFamily: "Gotham-Bold",
          }}
        >
          Spotify Helper
        </Text>
      </Header>
      <View
        ref={content}
        style={{
          position: "fixed",
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          height: open ? 70 : 0,
          transition: "height 200ms ease-in-out",
          paddingHorizontal: 10,
          gap: 5,
          backgroundColor: colors.primary,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          top: 60,
          left: 0,
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          zIndex: 2,
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
              key={name}
              onPress={() => setTheme(name)}
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
      {vertical ? (
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
              vertical={vertical}
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
