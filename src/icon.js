import { useState } from "react";
import { Image, Pressable, StyleSheet, Text } from "react-native";

const background0 = "rgba(214, 192, 92, 0.1)";
const background1 = "rgba(214, 192, 92, 0.4)";
const accents = "rgba(214, 192, 92, 0.7)";

export default function Icon({ playlist, onPress }) {
  const [pressed, setPressed] = useState(false);
  var timeout;

  return (
    <Pressable
      key={playlist.name}
      style={[
        styles.button,
        {
          backgroundColor: pressed ? background1 : background0,
        },
      ]}
      onPressIn={() => {
        setPressed(true);
        clearTimeout(timeout);
      }}
      onPress={() => {
        timeout = setTimeout(() => {
          setPressed(false);
        }, 150);
        onPress(playlist.tracks);
      }}
    >
      <Image source={playlist.image} style={styles.icon} />
      <Text
        style={{
          height: "100%",
          width: "100%",
          textAlign: "center",
          fontSize: 15,
          color: accents,
          fontWeight: "bold",
          padding: 5,
          paddingBottom: 15,
        }}
      >
        {playlist.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 120,
    margin: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 100,
    height: 100,
    margin: 10,
    borderWidth: 2,
    borderColor: accents,
    borderRadius: 5,
  },
});
