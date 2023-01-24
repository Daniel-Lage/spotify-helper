import { useState } from "react";
import { Image, Pressable, Text } from "react-native";
import Button from "../../components/button";
import Colors from "../../colors";

export default function Icon({ image, name, addToQueue, onPress, theme }) {
  const colors = Colors(theme);
  const [active, setActive] = useState(false);
  var activeTimeout;

  return (
    <Pressable
      style={{
        width: 120,
        alignItems: "center",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        backgroundColor: active ? colors.active : colors.inactive,
      }}
      onPressIn={() => {
        setActive(true);
        clearTimeout(activeTimeout);
      }}
      onPressOut={() => {
        activeTimeout = setTimeout(() => {
          setActive(false);
        }, 150);
      }}
      onPress={onPress}
    >
      <Image
        source={image}
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
        {name}
      </Text>

      <Button
        theme={theme}
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
