import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./src/home";
import Playlist from "./src/playlist";
import { useEffect, useState } from "react";
import LoadingScreen from "./src/load";
import request from "request";

const Stack = createNativeStackNavigator();

export default function App() {
  const params = new URLSearchParams(window.location.search);

  function refresh() {
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

  useEffect(() => {
    if (!params.get("code")) {
      refresh();
      return;
    }

    if (!sessionStorage.getItem("refresh_token")) {
      // get refresh token
      request.post(
        {
          url: "https://accounts.spotify.com/api/token",
          form: {
            code: params.get("code"),
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
          if (body.error) {
            refresh();
            return;
          }
          sessionStorage.setItem("refresh_token", body.refresh_token);
        }
      );
    }
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: "Spotify Helper - Home Screen" }}
        />
        <Stack.Screen
          name="Playlist"
          component={Playlist}
          options={{ title: "Spotify Helper - Playlist" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
