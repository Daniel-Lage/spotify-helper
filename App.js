import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./src/home";
import Playlist from "./src/playlist";
import { useEffect, useState } from "react";
import LoadingScreen from "./src/load";
import request from "request";

const Stack = createNativeStackNavigator();

var auth_code;

const colors = {
  primary: "hsl(216, 60%, 60%)",
  secondary: "hsl(216, 35%, 35%)",
  background: "hsl(216, 10%, 10%)",
  default: "hsl(216, 75%, 70%)",
  opening: "hsl(216, 20%, 20%)",
};

export default function () {
  const params = new URLSearchParams(window.location.search);
  const [refreshToken, setRefreshToken] = useState();

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
  }

  useEffect(() => {
    if (!params.get("code")) {
      refresh();
      return <View style={styles.container} />;
    } else {
      auth_code = params.get("code");
    }

    if (!refreshToken) {
      // get refresh token
      request.post(
        {
          url: "https://accounts.spotify.com/api/token",
          form: {
            code: auth_code,
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
          setRefreshToken(body.refresh_token);
        }
      );
      return;
    }
  }, []);

  if (!refreshToken) return <LoadingScreen colors={colors} />;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: "Home Screen" }}
          initialParams={{ refreshToken: refreshToken, colors: colors }}
        />
        <Stack.Screen
          name="Playlist"
          component={Playlist}
          options={{ title: "Playlist" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
