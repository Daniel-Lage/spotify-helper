import { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import Header from "../header";

import request from "request";

export default function Start({ navigation, colors }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authCode = params.get("code");

    if (authCode) {
      request.post(
        {
          url: "https://accounts.spotify.com/api/token",
          form: {
            code: authCode,
            redirect_uri: window.location.origin,
            grant_type: "authorization_code",
          },
          headers: {
            Authorization:
              "Basic ZWQxMjMyODcxMTMzNDVjNDkzMzhkMWNmMjBiZWM5MGU6NjE2Mzg1ZjJlYzNkNGQ2M2E3OWJkMWIxZGZhM2M4MGM=",
          },
          json: true,
        },
        (error, response, body) => {
          setLoading(false);

          console.log("request: get refresh token");

          if (body.error) return console.error(body);

          localStorage.refreshToken = body.refresh_token;
          navigation.navigate("Home");
        }
      );
    } else setLoading(false);
  }, []);

  function login() {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: "ed123287113345c49338d1cf20bec90e",
      scope: [
        "user-read-playback-state",
        "user-modify-playback-state",
        "user-read-private",
      ].join(" "),
      redirect_uri: window.location.origin,
    });
    window.location.assign(
      "https://accounts.spotify.com/authorize?" + params.toString()
    );
    return;
  }

  return (
    loading || (
      <View
        style={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <Header colors={colors}>
          <Text
            numberOfLines={2}
            style={{
              fontSize: 20,
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
              width: 50,
              height: 50,
            }}
          />
        </Header>
        <View
          style={{
            width: "100%",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Pressable onPress={login}>
            <Text
              style={{
                fontWeight: "bold",
                padding: 10,
                borderRadius: 5,
                backgroundColor: colors.primary,
                color: colors.secondary,
              }}
            >
              Login with Spotify
            </Text>
          </Pressable>
        </View>
      </View>
    )
  );
}
