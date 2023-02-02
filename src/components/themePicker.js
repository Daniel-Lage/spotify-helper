import { useState } from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getThemes } from "../colors";

export default function ThemePicker({ size, top, theme, setTheme, colors }) {
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
            backgroundColor: colors.primary,
            position: "fixed",
            alignSelf: "flex-start",
            borderRadius: 20,
            padding: 5,
            transition: "top 400ms ease-in-out",
            zIndex: -1,
            top: open ? top + 10 : 0,
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
              }}
            >
              <Ionicons color={value[1].primary} name="ellipse" size={size} />
            </Pressable>
          ))}
      </View>
    </>
  );
}
