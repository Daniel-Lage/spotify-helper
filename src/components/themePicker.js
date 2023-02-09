import { Pressable, View } from "react-native";
import { useState } from "react";

import { Ionicons } from "@expo/vector-icons";

import { getThemes } from "../colors";

export default function ThemePicker({ size, theme, setTheme, colors }) {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ position: "absolute", alignSelf: "flex-start" }}>
      <Pressable
        onPress={() => {
          setOpen((prev) => !prev);
        }}
      >
        <Ionicons name="color-palette" size={size} color={colors.secondary} />
      </Pressable>

      <View
        style={[
          {
            flexDirection: "row",
            maxHeight: "10vh",
            backgroundColor: colors.primary,
            position: "absolute",
            zIndex: -1,
            borderRadius: 20,
            transition: "top 400ms ease-in-out",
            top: open ? "12vh" : 0,
          },
        ]}
      >
        {getThemes()
          .filter((value) => value[0] != theme)
          .map((value) => (
            <Pressable
              key={value[0]}
              onPress={() => {
                if (open) setTheme(value[0]);
              }}
              style={{
                transition: open
                  ? "opacity 200ms linear 300ms"
                  : "opacity 200ms linear 100ms",
                opacity: open ? 1 : 0,
                cursor: open ? "pointer" : "default",
              }}
            >
              <Ionicons color={value[1].primary} name="ellipse" size={size} />
            </Pressable>
          ))}
      </View>
    </View>
  );
}
