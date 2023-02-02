import { useState } from "react";
import { Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export default function Button({ colors, onPress, symbol, style, size }) {
  const [active, setActive] = useState(false);

  var timeout;

  return (
    <Pressable
      onPressIn={() => {
        setActive(true);
        clearTimeout(timeout);
      }}
      onPressOut={() => {
        timeout = setTimeout(() => {
          setActive(false);
        }, 150);
      }}
      onPress={() => {
        onPress();
      }}
      style={style}
    >
      <AntDesign
        color={active ? colors.btn_active : colors.btn_inactive}
        name={symbol}
        size={size}
      />
    </Pressable>
  );
}
