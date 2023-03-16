import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Dimensions } from "react-native";

import { getColors, getThemes } from "./src/colors";
import Home from "./src/home";
import Playlist from "./src/playlist";
import Start from "./src/start";

const Stack = createNativeStackNavigator();

const { height, width } = Dimensions.get("window");
const aspectRatio = height / width;
const mobile = aspectRatio > 1.6;

export default function App() {
  const localtheme = localStorage.theme;

  const [theme, setTheme] = useState(
    getThemes().some(([name, _]) => name === localtheme) ? localtheme : "blue"
  );

  const colors = getColors(theme);

  useEffect(() => {
    localStorage.theme = theme;
  }, [theme]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={localStorage.refreshToken ? "Home" : "Start"}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Start"
          options={{ title: "Spotify Helper - Start" }}
        >
          {({ navigation }) => (
            <Start colors={colors} navigation={navigation} />
          )}
        </Stack.Screen>
        <Stack.Screen name="Home" options={{ title: "Spotify Helper - Home" }}>
          {({ navigation }) => (
            <Home
              theme={theme}
              setTheme={setTheme}
              colors={colors}
              navigation={navigation}
              mobile={mobile}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="Playlist"
          options={{ title: "Spotify Helper - Playlist" }}
          initialParams={{
            playlist: {
              collaborative: false,
              description: "",
              external_urls: {
                spotify:
                  "https://open.spotify.com/playlist/6f66wS3E3NEcxIFFBLvx8T",
              },
              href: "https://api.spotify.com/v1/playlists/6f66wS3E3NEcxIFFBLvx8T",
              id: "6f66wS3E3NEcxIFFBLvx8T",
              images: [
                {
                  height: null,
                  url: "https://i.scdn.co/image/ab67706c0000bebb4597fc6c1c9ce407213b2c0e",
                  width: null,
                },
              ],
              name: "DOR.",
              owner: {
                display_name: "Lucas Maciel",
                external_urls: {
                  spotify: "https://open.spotify.com/user/lucas7maciel",
                },
                href: "https://api.spotify.com/v1/users/lucas7maciel",
                id: "lucas7maciel",
                type: "user",
                uri: "spotify:user:lucas7maciel",
              },
              primary_color: null,
              public: false,
              snapshot_id:
                "MTIsODJjY2U4MTU5ZGYyNTY1ZDRlNWZiOWZiYjk1MzI2ZTRjZGMwOTQyYQ==",
              tracks: {
                href: "https://api.spotify.com/v1/playlists/6f66wS3E3NEcxIFFBLvx8T/tracks",
                total: 2,
              },
              type: "playlist",
              uri: "spotify:playlist:6f66wS3E3NEcxIFFBLvx8T",
            },
          }}
        >
          {({ navigation, route }) => (
            <Playlist
              colors={colors}
              navigation={navigation}
              route={route}
              mobile={mobile}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
