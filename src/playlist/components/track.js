import { Image, Pressable, Text, View } from "react-native";
import Button from "../../components/button";
import colors from "../../components/colors";

export default function Track({
  track: {
    album: { images },
    name,
    artists,
  },
  index,
  onPress,
}) {
  const image = images[2];
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        gap: 10,
        width: "80vw",
        padding: 10,
        borderRadius: 5,
        backgroundColor: colors.default,
      }}
    >
      <Image
        source={image.url}
        style={{
          width: 32,
          height: 32,
          borderRadius: 5,
        }}
      />
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
