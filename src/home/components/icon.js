import { Image, Pressable, Text, View, Dimensions } from "react-native";
import Cover from "../../components/cover";

import PlayButton from "../../components/playbutton";

const { height, width } = Dimensions.get("window");
const aspectRatio = height / width;

export default function Icon({
  image,
  name,
  author,
  addToQueue,
  onPress,
  colors,
}) {
  return aspectRatio > 1.6 ? (
    <Pressable
      style={{
        alignItems: "center",
        borderRadius: 5,
        backgroundColor: colors.item,
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      }}
      onPress={onPress}
    >
      <Cover image={image} colors={colors} size={42} />
      <Text
        numberOfLines={1}
        style={{
          width: "40vw",
          fontSize: 15,
          color: colors.primary,
          fontWeight: "bold",
          padding: 5,
        }}
      >
        {name}
      </Text>
      <Text
        numberOfLines={1}
        style={{
          width: "40vw",
          fontSize: 15,
          color: colors.secondary,
          fontWeight: "bold",
          padding: 5,
          paddingBottom: 15,
        }}
      >
        {author}
      </Text>
    </Pressable>
  ) : (
    <Pressable
      style={{
        alignItems: "center",
        borderRadius: 5,
        backgroundColor: colors.item,
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      }}
      onPress={onPress}
    >
      <Cover image={image} colors={colors} size={18} />
      <Text
        numberOfLines={1}
        style={{
          width: "18vw",
          fontSize: 15,
          color: colors.primary,
          fontWeight: "bold",
          padding: 5,
        }}
      >
        {name}
      </Text>
      <Text
        numberOfLines={1}
        style={{
          width: "18vw",
          fontSize: 15,
          color: colors.secondary,
          fontWeight: "bold",
          padding: 5,
          paddingBottom: 15,
        }}
      >
        {author}
      </Text>
    </Pressable>
  );
}
