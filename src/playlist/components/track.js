import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

export default function Track({
  track: {
    album: { images },
    name,
    artists,
  },
  index,
  onPress,
  colors,
}) {
  const [active, setActive] = useState(false);
  var activeTimeout;

  const image = images[2];
  return (
    <Pressable
      style={{
        flexDirection: "row",
        gap: 10,
        width: "80vw",
        padding: 5,
        borderRadius: 5,
        backgroundColor: active ? colors.active : colors.inactive,
      }}
      onPressIn={() => {
        setActive(true);
        clearTimeout(activeTimeout);
      }}
      onPressOut={() => {
        activeTimeout = setTimeout(() => {
          setActive(false);
        }, 150);
      }}
      onPress={onPress}
    >
      {image && (
        <Image
          source={image.url}
          style={{
            width: 32,
            height: 32,
            borderRadius: 5,
          }}
        />
      )}
      <Text
        style={{
          color: colors.background,
          fontWeight: "bold",
          fontSize: 24,
        }}
      >
        {index + 1}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "1vw",
          flexWrap: "wrap",
          flex: 1,
        }}
      >
        <Text
          style={{
            color: colors.background,
            fontWeight: "bold",
          }}
        >
          {name}
        </Text>
        <Text
          style={{
            color: colors.secondary,
            fontWeight: "500",
          }}
        >
          {artists.map(({ name }) => name).join(", ")}
        </Text>
      </View>
    </Pressable>
  );
}
