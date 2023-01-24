import { useState } from "react";
import { Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Colors from "../colors";

export default function Button({ symbol, onPress, style, size, theme }) {
  const [active, setActive] = useState(false);
  const colors = Colors(theme);
  var timeout;
  return (
    <Pressable
      style={style}
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
    >
      <AntDesign
        name={symbol}
        size={size}
        color={active ? colors.btn_active : colors.btn_inactive}
      />
    </Pressable>
  );
}
