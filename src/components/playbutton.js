import { useState } from "react";
import { Pressable, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export default function PlayButton({ colors, onPress, style, size }) {
  const [pressed, setPressed] = useState(false);
  var timeout;

  return (
    <Pressable
      onPressIn={() => {
        setPressed(true);
        clearTimeout(timeout);
      }}
      onPressOut={() => {
        timeout = setTimeout(() => {
          setPressed(false);
        }, 150);
      }}
      onPress={() => {
        onPress();
      }}
      style={[
        style,
        {
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
    >
      <AntDesign
        name="caretright"
        size={`${(size * 3) / 5}vw`}
        color={colors.background}
        style={{
          position: "absolute",
          zIndex: 1,
        }}
      />
      <View
        style={{
          width: `${size}vw`,
          height: `${size}vw`,
          borderRadius: `${size}vw`,
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          position: "absolute",
          backgroundColor: pressed ? colors.secondary : colors.primary,
        }}
      />
    </Pressable>
  );
}
