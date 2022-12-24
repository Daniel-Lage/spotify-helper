import { useState } from "react";
import { Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export default function ({ onColor, offColor, symbol, onPress, style, size }) {
  const [on, setOn] = useState(false);
  var timeout;
  return (
    <Pressable
      style={style}
      onPressIn={() => {
        setOn(true);
        clearTimeout(timeout);
      }}
      onPressOut={() => {
        timeout = setTimeout(() => {
          setOn(false);
        }, 150);
      }}
      onPress={() => {
        onPress();
      }}
    >
      <AntDesign name={symbol} size={size} color={on ? onColor : offColor} />
    </Pressable>
  );
}
