import { useState } from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getThemes } from "../colors";

export default function ThemePicker({ size, theme, setTheme, colors }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => {
          if (top) setOpen((prev) => !prev);
        }}
        style={{ position: "absolute", alignSelf: "flex-start" }}
      >
        <Ionicons name="color-palette" size={size} color={colors.secondary} />
      </Pressable>

      <View
        style={[
          {
            flexDirection: "row",
            maxHeight: "10vh",
            backgroundColor: colors.primary,
            position: "fixed",
            alignSelf: "flex-start",
            borderRadius: 20,
            transition: "top 400ms ease-in-out",
            zIndex: -1,
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
    </>
  );
}
