import { Pressable, Text } from "react-native";
import Cover from "../cover";

export default function Icon({
  image,
  name,
  author,
  addToQueue,
  onPress,
  colors,
  vertical,
}) {
  return vertical ? (
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
      <Cover image={image} colors={colors} size={140} onPress={addToQueue} />
      <Text
        numberOfLines={1}
        style={{
          width: 140,
          fontSize: 15,
          color: colors.primary,
          padding: 5,
          fontFamily: "Roboto-Regular",
          fontWeight: "bold",
        }}
      >
        {name}
      </Text>
      <Text
        numberOfLines={1}
        style={{
          width: 140,
          fontSize: 17,
          color: colors.secondary,
          padding: 5,
          paddingBottom: 15,
          fontFamily: "Roboto-Regular",
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
      <Cover image={image} colors={colors} size={250} onPress={addToQueue} />
      <Text
        numberOfLines={1}
        style={{
          width: 250,
          fontSize: 17,
          color: colors.primary,
          padding: 5,
          fontFamily: "Roboto-Regular",
        }}
      >
        {name}
      </Text>
      <Text
        numberOfLines={1}
        style={{
          width: 250,
          fontSize: 15,
          color: colors.secondary,
          padding: 5,
          paddingBottom: 15,
          fontFamily: "Roboto-Regular",
        }}
      >
        {author}
      </Text>
    </Pressable>
  );
}
