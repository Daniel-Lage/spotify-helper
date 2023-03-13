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
import ThemePicker from "../themePicker";
import Icon from "./icon";

const { height, width } = Dimensions.get("window");
const aspectRatio = height / width;
const mobile = aspectRatio > 1.6;

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

export default function Home({ theme, setTheme, colors, navigation }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sortKey, setSortKey] = useState(
    localStorage.getItem("playlist-sort-key") || "Name"
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
    localStorage.setItem("playlist-sort-key", sortKey);
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
        minHeight: "100%",
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
          <Pressable
            onPress={() => {
              localStorage.removeItem("refresh_token");
              navigation.navigate("Start");
            }}
          >
            <AntDesign name="back" size={"9vh"} color={colors.secondary} />
          </Pressable>
          <ThemePicker
            size={"9vh"}
            theme={theme}
            setTheme={setTheme}
            colors={colors}
          />
        </View>
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
        {mobile ? (
          <View style={{ marginTop: "1vh", zIndex: 1 }}>
            <TextInput
              value={filter}
              onChangeText={setFilter}
              placeholder="Search"
              style={{
                height: "4vh",
                width: "30vh",
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
              width: "90%",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: "1vh",
              zIndex: 1,
            }}
          >
            <TextInput
              value={filter}
              onChangeText={setFilter}
              placeholder="Search"
              style={{
                height: "4vh",
                width: "30vh",
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
            flexWrap: "wrap",
            paddingVertical: "2vh",
            flexDirection: "row",
            justifyContent: "center",
            gap: "2vh",
          }}
        >
          {loading ||
            filteredPlaylists.map((playlist) => (
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
