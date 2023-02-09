import { Image, Pressable, Text, View, Dimensions } from "react-native";
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
      <View
        style={{
          alignItems: "flex-end",
          justifyContent: "flex-end",
        }}
      >
        <Image
          source={image}
          style={{
            width: "40vw",
            height: "40vw",
            borderTopRightRadius: 5,
            borderTopLeftRadius: 5,
          }}
        />
        <PlayButton
          colors={colors}
          onPress={() => {
            addToQueue();
          }}
          symbol="play"
          style={{
            marginBottom: "10vw",
            marginRight: "10vw",
            position: "absolute",
          }}
          size={12}
        />
      </View>
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
      <View
        style={{
          alignItems: "flex-end",
          justifyContent: "flex-end",
        }}
      >
        <Image
          source={image}
          style={{
            width: "18vw",
            height: "18vw",
            borderTopRightRadius: 5,
            borderTopLeftRadius: 5,
          }}
        />
        <PlayButton
          colors={colors}
          onPress={() => {
            addToQueue();
          }}
          symbol="play"
          style={{
            marginBottom: "3vw",
            marginRight: "3vw",
            position: "absolute",
          }}
          size={4}
        />
      </View>
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
