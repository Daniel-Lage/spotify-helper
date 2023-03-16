import { Pressable, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";

export default function Sorter({
  colors,
  sortKey,
  setSortKey,
  keys,
  reversed,
  setReversed,
}) {
  const [open, setOpen] = useState(false);

  return (
    <Pressable
      onPress={() => {
        setOpen((prev) => !prev);
      }}
      style={{
        flexDirection: "row",
        justifyContent: "center",
        height: 30,
        width: 250,
        backgroundColor: colors.item,
        borderRadius: 5,
        borderBottomLeftRadius: open ? 0 : 5,
        borderBottomRightRadius: open ? 0 : 5,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: colors.accents,
          userSelect: "none",
        }}
      >
        Sort By:
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          {sortKey}
        </Text>
      </Text>
      <View
        style={{
          position: "absolute",
          width: "100%",
          top: 30,
          gap: 3,
          alignItems: "center",
          borderColor: colors.background,
          borderRadius: 5,
          borderTopLeftRadius: open ? 0 : 5,
          borderTopRightRadius: open ? 0 : 5,
          backgroundColor: colors.item,
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          zIndex: 1,
        }}
      >
        {open &&
          Object.keys(keys).map((name) => {
            if (name === sortKey)
              return (
                <Text
                  key={name}
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    color: colors.accents,
                  }}
                >
                  {name}
                </Text>
              );

            return (
              <Pressable onPress={() => setSortKey(name)} key={name}>
                <Text
                  key={name}
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    color: colors.primary,
                  }}
                >
                  {name}
                </Text>
              </Pressable>
            );
          })}
      </View>
      <Pressable
        style={{ marginTop: 6 }}
        onPress={() => setReversed((prev) => !prev)}
      >
        {reversed ? (
          <AntDesign name="up" size={20} color={colors.accents} />
        ) : (
          <AntDesign name="down" size={20} color={colors.accents} />
        )}
      </Pressable>
    </Pressable>
  );
}
