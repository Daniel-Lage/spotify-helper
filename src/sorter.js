import { Pressable, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRef, useState } from "react";

export default function Sorter({
  colors,
  sortKey,
  setSortKey,
  keys,
  reversed,
  setReversed,
}) {
  const [open, setOpen] = useState(false);

  const content = useRef();

  console.log(content);

  return (
    <View>
      <Pressable
        onPress={() => {
          setOpen((prev) => !prev);
        }}
        onBlur={() => {
          console.log("not focused");
        }}
        style={{
          flexDirection: "row",
          justifyContent: "center",
          height: 25,
          width: 250,
          backgroundColor: colors.item,
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
          style={{ marginTop: 5 }}
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
          top: 25,
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
          paddingBottom: 5,
          transition: "height 200ms ease-in-out",
        }}
      >
        {Object.keys(keys).map((name) => {
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
    </View>
  );
}
