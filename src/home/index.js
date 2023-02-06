import { useEffect, useRef, useState } from "react";
import { Image, Text, View } from "react-native";
import { useToken } from "../../src/functions";
import request from "request";
import Icon from "./components/icon";
import Load from "../load";
import ThemePicker from "../components/themePicker";
import Header from "../components/header";

export default function Home({ theme, setTheme, colors, navigation }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

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
      setPlaylists(tempList);
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
          console.log("test");
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
              console.log(body);
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
        backgroundColor: "black",
        gap: 20,
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
            marginHorizontal: 64,
          }}
        >
          Spotify Helper
        </Text>
      </Header>
      {loading ? (
        <Load colors={colors} />
      ) : (
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-evenly",
            marginTop: "12vh",
            marginBottom: "2vh",
          }}
        >
          {playlists.map((playlist) => (
            <Icon
              colors={colors}
              key={playlist.id}
              name={playlist.name}
              owner={playlist.owner.display_name}
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
      )}
    </View>
  );
}
