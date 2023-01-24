import { useState } from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../colors";

export default function ThemePicker({ style, size, top, theme, setTheme }) {
  const [open, setOpen] = useState(false);
  const colors = Colors(theme);

  return (
    <Pressable
      style={style}
      onPress={() => {
        if (top) setOpen((prev) => !prev);
      }}
    >
      <Ionicons name="color-palette" size={size} color={colors.secondary} />
      {open && (
        <View
          style={{
            flexDirection: "row",
            backgroundColor: colors.secondary,
            position: "absolute",
            top: top,
            borderRadius: 20,
            padding: 5,
          }}
        >
          <Pressable
            onPress={() => {
              setTheme("blue");
            }}
          >
            <Ionicons
              name="color-palette"
              size={size}
              color="hsl(216, 60%, 60%)"
            />
          </Pressable>
          <Pressable
            onPress={() => {
              setTheme("pink");
            }}
          >
            <Ionicons
              name="color-palette"
              size={size}
              color="hsl(342, 60%, 60%)"
            />
          </Pressable>
        </View>
      )}
    </Pressable>
  );
}
