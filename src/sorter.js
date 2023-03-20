import { Pressable, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";

export default function Sorter({
  colors,
  sortKey,
  setSortKey,
  keys,
  reversed,
  setReversed,
}) {
  useEffect(() => {
    window.addEventListener("click", (e) =>
      setOpen(content.current?.contains(e.target))
    );
  }, []);

  const [open, setOpen] = useState(false);

  const content = useRef();

  return (
    <View>
      <Pressable
        onPress={() => setOpen((prev) => !prev)}
        style={{
          flexDirection: "row",
          justifyContent: "center",
          height: 30,
          width: 250,
          backgroundColor: colors.item,
          borderRadius: open ? 0 : 5,
          transition: open || "border-radius 0ms linear 200ms",
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
          zIndex: 2,
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
      <View
        ref={content}
        style={{
          position: "absolute",
          overflow: "hidden",
          alignItems: "center",
          top: 30,
          width: 250,
          borderColor: colors.background,
          borderBottomLeftRadius: 5,
          borderBottomRightRadius: 5,
          backgroundColor: colors.item,
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          zIndex: 1,
          height: open ? content.current.scrollHeight : 0,
          transition: "height 200ms ease-in-out",
        }}
      >
        {Object.keys(keys).map((name, index, array) => (
          <Text
            key={name}
            style={{
              fontSize: 15,
              fontWeight: "bold",
              color: name === sortKey ? colors.accents : colors.primary,
              marginBottom: index === array.length - 1 ? 5 : 0,
            }}
          >
            {name}
          </Text>
        ))}
      </View>
    </View>
  );
}
