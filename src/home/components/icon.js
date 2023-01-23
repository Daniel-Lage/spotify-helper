import { useState } from "react";
import { Image, Pressable, Text } from "react-native";
import Button from "../../components/button";
import colors from "../../components/colors";

export default function Icon({ playlist, addToQueue, open }) {
  const [active, setActive] = useState(false);
  var addTimeout;

  return (
    <Pressable
      style={{
        width: 120,
        alignItems: "center",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        backgroundColor: active ? colors.active : colors.primary,
      }}
      onPressIn={() => {
        setActive(true);
        clearTimeout(addTimeout);
      }}
      onPressOut={() => {
        addTimeout = setTimeout(() => {
          setActive(false);
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
          pactive: 5,
          pactiveBottom: 15,
        }}
      >
        {playlist.name}
      </Text>

      <Button
        style={{ alignSelf: "flex-end", marginRight: 10, marginBottom: 10 }}
        symbol="play"
        onPress={() => {
          addToQueue();
        }}
        activeColor={colors.opening}
        inactiveColor={colors.secondary}
        size={30}
      />
    </Pressable>
  );
}
