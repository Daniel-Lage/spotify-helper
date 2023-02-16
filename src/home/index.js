import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";

import request from "request";
import { useToken } from "../../src/functions";

import Header from "../components/header";
import Sorter from "../components/sorter";
import ThemePicker from "../components/themePicker";
import Icon from "./components/icon";

const sortKeys = { Name: ["name"], Author: ["owner", "display_name"] };

export default function Home({ theme, setTheme, colors, navigation }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sortKey, setSortKey] = useState(
    localStorage.getItem("playlist-sort-key") || "Name"
  );
  const [sortOrder, setSortOrder] = useState(
    parseInt(localStorage.getItem("playlist-sort-order")) || 1
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
      setPlaylists(
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
    localStorage.setItem("playlist-sort-key", sortKey);
    setPlaylists((prev) => {
      const tempList = [...prev];
      return tempList.sort((a, b) => {
        sortKeys[sortKey].forEach((index) => {
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
    localStorage.setItem("playlist-sort-order", sortOrder.toString());
    setPlaylists((prev) => {
      const next = [...prev];
      return next.reverse();
    });
  }, [sortOrder]);

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
        minHeight: "100%",
        alignItems: "center",
        backgroundColor: colors.background,
      }}
    >
      <Header colors={colors}>
        <ThemePicker
          size={"9vh"}
          theme={theme}
          setTheme={setTheme}
          colors={colors}
        />
        <Image
          source={require("../../assets/icon.png")}
          style={{
            position: "absolute",
            alignSelf: "flex-end",
            width: "9vh",
            height: "9vh",
          }}
        />
        <Text
          style={{
            fontSize: "3vh",
            fontWeight: "bold",
            color: colors.secondary,
            textAlign: "center",
            zIndex: 1,
            marginHorizontal: "9vh",
          }}
        >
          Spotify Helper
        </Text>
      </Header>
      <View
        style={{
          width: "100%",
          height: "90vh",
          overflowY: "scroll",
          alignItems: "center",
        }}
      >
        <Sorter
          colors={colors}
          sortKey={sortKey}
          setSortKey={setSortKey}
          keys={sortKeys}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
        <View
          style={{
            width: "100%",
            flexWrap: "wrap",
            paddingVertical: "2vh",
            flexDirection: "row",
            justifyContent: "center",
            gap: "2vh",
          }}
        >
          {loading ||
            playlists.map((playlist) => (
              <Icon
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
    </View>
  );
}
