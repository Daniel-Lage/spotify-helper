import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

export default function Track({ track, index, onPress, colors, vertical }) {
  const [pressed, setPressed] = useState(false);
  var timeout;

  const song = track.track;
  const image = song.album.images[0];
  const added_at = new Date(track.added_at);

  return (
    <Pressable
      style={{
        width: "90%",
        borderRadius: 5,
        backgroundColor: pressed ? colors.dark_item : colors.item,
        flexDirection: "row",
        alignItems: "center",
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      }}
      onPressIn={() => {
        setPressed(true);
        clearTimeout(timeout);
      }}
      onPressOut={() => (timeout = setTimeout(() => setPressed(false), 150))}
      onPress={onPress}
    >
      <Image
        source={image?.url}
        style={{
          width: 50,
          height: 50,
          backgroundColor: colors.dark_item,
        }}
      />
      {vertical ? (
        <View
          style={{
            flex: 1,
            marginLeft: 10,
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              color: colors.primary,
              fontSize: 20,
              fontFamily: "Roboto-Regular",
            }}
          >
            {song.name}
          </Text>
          <Text
            style={{
              color: colors.secondary,
              fontSize: 15,
              fontFamily: "Roboto-Regular",
            }}
          >
            {song.artists.map(({ name }) => name).join(", ")}
          </Text>
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "33%",
              flexWrap: "wrap",
              marginLeft: 10,
            }}
          >
            <Text
              style={{
                color: colors.primary,
                fontSize: 20,
                fontFamily: "Roboto-Regular",
              }}
            >
              {song.name}
            </Text>
            <Text
              style={{
                color: colors.secondary,
                fontSize: 15,
                fontFamily: "Roboto-Regular",
              }}
            >
              {song.artists.map(({ name }) => name).join(", ")}
            </Text>
          </View>
          <Text
            style={{
              width: "33%",
              color: colors.secondary,
              fontSize: 15,
              marginLeft: 10,
              fontFamily: "Roboto-Regular",
            }}
          >
            {song.album.name}
          </Text>
          <Text
            style={{
              width: "33%",
              color: colors.secondary,
              fontSize: 15,
              fontFamily: "Roboto-Regular",
              marginLeft: 10,
            }}
          >
            {added_at.getDate() + 1}/{added_at.getMonth() + 1}/
            {added_at.getFullYear()}
          </Text>
        </View>
      )}
      <Text
        style={{
          color: colors.accents,
          fontSize: 30,
          paddingRight: 10,
          fontFamily: "Roboto-Regular",
        }}
      >
        {index + 1}
      </Text>
    </Pressable>
  );
}
