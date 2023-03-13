import { Pressable, View } from "react-native";
import { useState } from "react";

import { Ionicons } from "@expo/vector-icons";

import { getThemes } from "./colors";

export default function ThemePicker({ size, theme, setTheme, colors }) {
  const [open, setOpen] = useState(false);

  return (
    <View>
      <Pressable
        onPress={() => {
          setOpen((prev) => !prev);
        }}
      >
        <Ionicons name="color-palette" size={size} color={colors.secondary} />
      </Pressable>

      <View
        style={{
          flexDirection: "row",
          maxHeight: "10vh",
          backgroundColor: colors.primary,
          position: "absolute",
          zIndex: -1,
          borderRadius: 20,
          transition: "top 400ms ease-in-out",
          top: open ? "12vh" : 0,
        }}
      >
        {getThemes()
          .filter(([name, _]) => name != theme)
          .map(([name, theme]) => (
            <Pressable
              key={name}
              onPress={() => {
                if (open) setTheme(name);
              }}
              style={{
                transition: open
                  ? "opacity 200ms linear 300ms"
                  : "opacity 200ms linear 100ms",
                opacity: open ? 1 : 0,
                cursor: open ? "pointer" : "default",
              }}
            >
              <Ionicons color={theme.primary} name="ellipse" size={size} />
            </Pressable>
          ))}
      </View>
    </View>
  );
}
