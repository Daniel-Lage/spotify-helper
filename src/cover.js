import { Image, View } from "react-native";
import PlayButton from "./playbutton";

export default function Cover({ colors, image, size, onPress }) {
  return (
    <View
      style={{
        alignItems: "flex-end",
        justifyContent: "flex-end",
        shadowOpacity: 0.3,
        shadowRadius: 15,
      }}
    >
      <Image
        source={image}
        style={{
          width: `${size}vw`,
          height: `${size}vw`,
        }}
      />
      <PlayButton
        colors={colors}
        onPress={onPress}
        symbol="play"
        style={{
          margin: `${size / 6}vw`,
          position: "absolute",
        }}
        size={size / 4}
      />
    </View>
  );
}
