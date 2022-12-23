import { useState } from "react";
import { Image, Pressable, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export default function ({ playlist, addToQueue, open, colors }) {
  const [adding, setAdding] = useState(false);
  const [opening, setOpening] = useState(false);
  var addTimeout;
  var openTimeout;

  return (
    <Pressable
      key={playlist.name}
      style={{
        width: 120,
        alignItems: "center",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        backgroundColor: adding ? colors.background : colors.default,
      }}
      onPressIn={() => {
        setAdding(true);
        clearTimeout(addTimeout);
      }}
      onPressOut={() => {
        addTimeout = setTimeout(() => {
          setAdding(false);
        }, 150);
      }}
      onPress={() => {
        open();
      }}
    >
      <Image
        source={playlist.image}
        style={{
          width: 100,
          height: 100,
          margin: 10,
          borderRadius: 5,
        }}
      />
      <Text
        style={{
          height: "100%",
          width: "100%",
          textAlign: "center",
          fontSize: 15,
          color: colors.secondary,
          fontWeight: "bold",
          padding: 5,
          paddingBottom: 15,
        }}
      >
        {playlist.name}
      </Text>

      <Pressable
        style={{ alignSelf: "flex-end", marginRight: 10, marginBottom: 10 }}
        onPressIn={() => {
          setOpening(true);
          clearTimeout(openTimeout);
        }}
        onPressOut={() => {
          openTimeout = setTimeout(() => {
            setOpening(false);
          }, 150);
        }}
        onPress={() => {
          addToQueue();
        }}
      >
        <AntDesign
          name="pluscircle"
          size={24}
          color={opening ? colors.opening : colors.secondary}
        />
      </Pressable>
    </Pressable>
  );
}
