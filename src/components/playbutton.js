import { useState } from "react";
import { Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

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
      style={[style, { alignItems: "center", justifyContent: "center" }]}
    >
      <AntDesign
        style={{
          position: "absolute",
          zIndex: 1,
        }}
        color={pressed ? colors.secondary : colors.primary}
        name={"play"}
        size={size}
      />
      <FontAwesome
        style={{
          position: "absolute",
        }}
        color={"black"}
        name={"circle"}
        size={size}
      />
    </Pressable>
  );
}
