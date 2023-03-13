import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";

import { getColors, getThemes } from "./src/colors";
import Home from "./src/home";
import Playlist from "./src/playlist";
import Start from "./src/start";

const Stack = createNativeStackNavigator();

export default function App() {
  const localtheme = localStorage.getItem("theme");

  const [theme, setTheme] = useState(
    getThemes().some(([name, _]) => name === localtheme) ? localtheme : "blue"
  );

  const colors = getColors(theme);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={
          localStorage.getItem("refresh_token") ? "Home" : "Start"
        }
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
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="Playlist"
          options={{ title: "Spotify Helper - Playlist" }}
        >
          {({ navigation, route }) => (
            <Playlist colors={colors} navigation={navigation} route={route} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
