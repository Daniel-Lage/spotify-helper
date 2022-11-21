import { useState } from "react";
import { Image, Pressable, StyleSheet, Text } from "react-native";

export default function Icon({ playlist, onPress }) {
  const [pressed, setPressed] = useState(false);
  var timeout;

  return (
    <Pressable
      key={playlist.name}
      style={[
        styles.button,
        {
          backgroundColor: pressed
            ? "#rgba(214, 192, 92, 0.5)"
            : "#rgba(214, 192, 92, 0.1)",
        },
      ]}
      onPressIn={() => {
        setPressed(true);
        clearTimeout(timeout);
      }}
      onPress={() => {
        timeout = setTimeout(() => {
          setPressed(false);
        }, 400);
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
          color: "#d6c05c",
          fontWeight: "bold",
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
    border: "2px solid #d6c05c",
    borderRadius: 5,
  },
});
