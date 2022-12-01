import { useState } from "react";
import { Image, Pressable, StyleSheet, Text } from "react-native";

const colors = {
  away: "hsl(216, 10%, 10%)",
  focused: "hsl(216, 75%, 70%)",
  primary: "hsl(216, 35%, 35%)",
};

export default function Icon({ playlist, onPress }) {
  const [focused, setFocused] = useState(false);
  var timeout;

  return (
    <Pressable
      key={playlist.name}
      style={[
        styles.button,
        {
          backgroundColor: focused ? colors.focused : colors.away,
        },
      ]}
      onPressIn={() => {
        setFocused(true);
        clearTimeout(timeout);
      }}
      onPressOut={() => {
        timeout = setTimeout(() => {
          setFocused(false);
        }, 150);
      }}
      onPress={() => {
        onPress(playlist.tracks);
      }}
    >
      <Image source={playlist.image} style={styles.icon} />
      <Text style={styles.text}>{playlist.name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 120,
    alignItems: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  icon: {
    width: 100,
    height: 100,
    margin: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 5,
  },
  text: {
    height: "100%",
    width: "100%",
    textAlign: "center",
    fontSize: 15,
    color: colors.primary,
    fontWeight: "bold",
    padding: 5,
    paddingBottom: 15,
  },
});
