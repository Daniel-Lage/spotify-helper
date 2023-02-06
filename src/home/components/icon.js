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
        width: "45vw",
        marginBottom: "2vh",
        borderRadius: 5,
        backgroundColor: colors.item,
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
            margin: 10,
            borderRadius: 5,
          }}
        />
        <PlayButton
          colors={colors}
          onPress={() => {
            addToQueue();
          }}
          symbol="play"
          style={{
            margin: "10vw",
            position: "absolute",
          }}
          size={"12vw"}
        />
      </View>
      <Text
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
        width: "23vw",
        marginBottom: "2vh",
        borderRadius: 5,
        backgroundColor: colors.item,
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
            width: "20vw",
            height: "20vw",
            margin: 10,
            borderRadius: 5,
          }}
        />
        <PlayButton
          colors={colors}
          onPress={() => {
            addToQueue();
          }}
          symbol="play"
          style={{
            margin: "3vw",
            position: "absolute",
          }}
          size={"4vw"}
        />
      </View>
      <Text
        style={{
          width: "20vw",
          fontSize: 15,
          color: colors.primary,
          fontWeight: "bold",
          padding: 5,
        }}
      >
        {name}
      </Text>
      <Text
        style={{
          width: "20vw",
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
