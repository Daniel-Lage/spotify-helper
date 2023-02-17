import { Pressable, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";

export default function Sorter({
  colors,
  sortKey,
  setSortKey,
  keys,
  sortOrder,
  setSortOrder,
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
        height: "4vh",
        width: "30vh",
        backgroundImage: `linear-gradient(transparent,${colors.item})`,
        borderRadius: 5,
        zIndex: 1,
      }}
    >
      <Text
        style={{
          fontSize: "3vh",
          fontWeight: "bold",
          color: colors.accents,
          userSelect: "none",
        }}
      >
        Sort By:
        <Text
          style={{
            fontSize: "2vh",
            fontWeight: "bold",
            padding: "0.5vh",
          }}
        >
          {sortKey}
        </Text>
      </Text>
      <View
        style={{
          position: "absolute",
          width: "100%",
          top: "4.5vh",
          gap: "0.5vh",
          alignItems: "center",
          borderWidth: 2,
          borderColor: colors.background,
          borderRadius: 5,
          backgroundColor: colors.item,
        }}
      >
        {open &&
          Object.keys(keys).map((name) => {
            if (name === sortKey)
              return (
                <Text
                  key={name}
                  style={{
                    fontSize: "2vh",
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
                    fontSize: "2vh",
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
        style={{ marginTop: "0.8vh" }}
        onPress={() => setSortOrder((prev) => -prev)}
      >
        {sortOrder > 0 ? (
          <AntDesign name="up" size={"3vh"} color={colors.accents} />
        ) : (
          <AntDesign name="down" size={"3vh"} color={colors.accents} />
        )}
      </Pressable>
    </Pressable>
  );
}
