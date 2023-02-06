import { Image, Pressable, Text, View, Dimensions } from "react-native";
import PlayButton from "../../components/playbutton";

const { height, width } = Dimensions.get("window");
const aspectRatio = height / width;

export default function Icon({
  image,
  name,
  owner,
  addToQueue,
  onPress,
  colors,
}) {
  return (
    <Pressable
      style={{
        alignItems: "center",
        width: aspectRatio > 1.6 ? "45vw" : "23vw",
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
            width: aspectRatio > 1.6 ? "40vw" : "20vw",
            height: aspectRatio > 1.6 ? "40vw" : "20vw",
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
            margin: aspectRatio > 1.6 ? "10vw" : "3vw",
            position: "absolute",
          }}
          size={aspectRatio > 1.6 ? "12vw" : "4vw"}
        />
      </View>
      <Text
        style={{
          width: aspectRatio > 1.6 ? "40vw" : "20vw",
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
          width: aspectRatio > 1.6 ? "40vw" : "20vw",
          fontSize: 15,
          color: colors.secondary,
          fontWeight: "bold",
          padding: 5,
          paddingBottom: 15,
        }}
      >
        {owner}
      </Text>
    </Pressable>
  );
}
