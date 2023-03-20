import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

export default function Track({ track, index, onPress, colors, vertical }) {
  const [pressed, setPressed] = useState(false);
  var timeout;

  const song = track.track;
  const image = song.album.images[0];
  const added_at = new Date(track.added_at);

  return vertical ? (
    <Pressable
      style={{
        width: "90%",
        borderRadius: 5,
        backgroundColor: pressed ? colors.dark_item : colors.item,
        flexDirection: "row",
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
        }}
      />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          flexWrap: "wrap",
          marginLeft: 10,
        }}
      >
        <Text
          numberOfLines={1}
          style={{
            color: colors.primary,
            fontWeight: "bold",
          }}
        >
          {song.name}
        </Text>
        <Text
          style={{
            color: colors.secondary,
            fontWeight: "bold",
          }}
        >
          {song.artists.map(({ name }) => name).join(", ")}
        </Text>
      </View>
      <Text
        style={{
          color: colors.accents,
          fontWeight: "bold",
          fontSize: 30,
          justifyContent: "center",
          paddingRight: 10,
        }}
      >
        {index + 1}
      </Text>
    </Pressable>
  ) : (
    <Pressable
      style={{
        width: "90%",
        borderRadius: 5,
        backgroundColor: pressed ? colors.dark_item : colors.item,
        flexDirection: "row",
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
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            width: "33%",
            flexWrap: "wrap",
          }}
        >
          <Text
            style={{
              color: colors.primary,
              fontWeight: "bold",
              marginLeft: 10,
            }}
          >
            {song.name}
          </Text>
          <Text
            style={{
              color: colors.secondary,
              fontWeight: "bold",
              marginLeft: 10,
            }}
          >
            {song.artists.map(({ name }) => name).join(", ")}
          </Text>
        </View>
        <Text
          style={{
            width: "33%",
            color: colors.secondary,
            fontWeight: "bold",
            marginLeft: 10,
          }}
        >
          {song.album.name}
        </Text>
        <Text
          style={{
            width: "33%",
            color: colors.secondary,
            fontWeight: "bold",
            marginLeft: 10,
          }}
        >
          {added_at.getDate() + 1}/{added_at.getMonth() + 1}/
          {added_at.getFullYear()}
        </Text>
      </View>
      <Text
        style={{
          color: colors.accents,
          fontWeight: "bold",
          fontSize: 30,
          justifyContent: "center",
          paddingRight: 10,
        }}
      >
        {index + 1}
      </Text>
    </Pressable>
  );
}
