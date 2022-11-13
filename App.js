import { Pressable, StyleSheet, Text, View } from "react-native";
import request from "request";
import playlists from "./playlists.json";

export default function App() {
  const params = new URLSearchParams(window.location.search);

  var auth_code = params.get("code");
  if (!auth_code) {
    window.location.assign(
      "https://accounts.spotify.com/authorize?response_type=code&client_id=ed123287113345c49338d1cf20bec90e&scope=user-read-playback-state+user-modify-playback-state&redirect_uri=http%3A%2F%2Flocalhost%3A19006%2F"
    );
  }

  function addToQueue(href) {
    request.post(
      {
        url: "https://accounts.spotify.com/api/token",
        form: {
          code: auth_code,
          redirect_uri: "http://localhost:19006/",
          grant_type: "authorization_code",
        },
        headers: {
          Authorization:
            "Basic ZWQxMjMyODcxMTMzNDVjNDkzMzhkMWNmMjBiZWM5MGU6NjE2Mzg1ZjJlYzNkNGQ2M2E3OWJkMWIxZGZhM2M4MGM=",
        },
        json: true,
      },
      (error, response, body) => {
        auth_code = undefined;
        const token = body.access_token;
        request.get(
          {
            url: "https://api.spotify.com/v1/me/player",
            headers: { Authorization: "Bearer " + token },
            json: true,
          },
          (error, response, body) => {
            if (body) {
              const device_id = body.device.id;
              const is_playing = body.is_playing;

              request.get(
                {
                  url: href,
                  headers: { Authorization: "Bearer " + token },
                  json: true,
                },
                (error, response, body) => {
                  function shuffle(array) {
                    var currentIndex = array.length,
                      randomIndex;

                    // While there remain elements to shuffle.
                    while (currentIndex != 0) {
                      // Pick a remaining element.
                      randomIndex = Math.floor(Math.random() * currentIndex);
                      currentIndex--;

                      // And swap it with the current element.
                      [array[currentIndex], array[randomIndex]] = [
                        array[randomIndex],
                        array[currentIndex],
                      ];
                    }
                  }
                  const tracks = body.items.map((value) => value.track);
                  shuffle(tracks);

                  {
                    const query = new URLSearchParams({
                      uri: tracks.pop().uri,
                      device_id: device_id,
                    });
                    request.post({
                      url:
                        "https://api.spotify.com/v1/me/player/queue?" +
                        query.toString(),
                      headers: { Authorization: "Bearer " + token },
                      json: true,
                    });
                  }

                  if (!is_playing) {
                    const query = new URLSearchParams({
                      device_id: device_id,
                    });
                    request.put({
                      url:
                        "https://api.spotify.com/v1/me/player/next?" +
                        query.toString(),
                      headers: { Authorization: "Bearer " + token },
                      json: true,
                    });
                  }

                  {
                    const query = new URLSearchParams({
                      device_id: device_id,
                    });
                    request.post({
                      url:
                        "https://api.spotify.com/v1/me/player/next?" +
                        query.toString(),
                      headers: { Authorization: "Bearer " + token },
                      json: true,
                    });
                  }

                  tracks.forEach((track, index) => {
                    const query = new URLSearchParams({
                      uri: track.uri,
                      device_id: device_id,
                    });
                    request.post(
                      {
                        url:
                          "https://api.spotify.com/v1/me/player/queue?" +
                          query.toString(),
                        headers: { Authorization: "Bearer " + token },
                        json: true,
                      },
                      () => {
                        if (index === tracks.length - 1) {
                          window.location.assign(
                            "https://accounts.spotify.com/authorize?response_type=code&client_id=ed123287113345c49338d1cf20bec90e&scope=user-read-playback-state+user-modify-playback-state&redirect_uri=http%3A%2F%2Flocalhost%3A19006%2F"
                          );
                        }
                      }
                    );
                  });
                }
              );
            }
          }
        );
      }
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {playlists.map((playlist) => (
          <Pressable
            key={playlist.name}
            style={styles.button}
            onPress={() => addToQueue(playlist.tracks)}
          >
            <Text>{playlist.name}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  grid: {
    width: "70%",
    height: "70%",
    display: "grid",
    gap: 10,
    gridTemplateColumns: "33% 33% 33%",
    backgroundColor: "#fff",
  },
  button: {
    padding: 5,
    backgroundColor: "#4fb369",
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
