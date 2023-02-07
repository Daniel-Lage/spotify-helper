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
  const [pressed, setPressed] = useState(false);
  var timeout;

  const image = images[2];
  return (
    <Pressable
      style={{
        flexDirection: "row",
        gap: "2vw",
        width: "80vw",
        padding: 5,
        borderRadius: 5,
        backgroundColor: pressed ? colors.dark_item : colors.item,
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      }}
      onPressIn={() => {
        setPressed(true);
        clearTimeout(timeout);
      }}
      onPressOut={() => {
        timeout = setTimeout(() => {
          setPressed(false);
        }, 150);
      }}
      onPress={onPress}
    >
      {image && (
        <Image
          source={image.url}
          style={{
            width: 45,
            height: 45,
            borderRadius: 5,
          }}
        />
      )}
      <View
        style={{
          justifyContent: "center",
          flexWrap: "wrap",
          flex: 1,
        }}
      >
        <Text
          style={{
            color: colors.primary,
            fontWeight: "bold",
          }}
        >
          {name}
        </Text>
        <Text
          style={{
            color: colors.secondary,
            fontWeight: "bold",
          }}
        >
          {artists.map(({ name }) => name).join(", ")}
        </Text>
      </View>
      <Text
        style={{
          color: "white",
          fontWeight: "bold",
          fontSize: 30,
        }}
      >
        {index + 1}
      </Text>
    </Pressable>
  );
}
