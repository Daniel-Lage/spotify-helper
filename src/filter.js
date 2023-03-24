import { Pressable, TextInput, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export default function Filter({ filter, setFilter, colors }) {
  return (
    <View
      style={{
        height: 30,
        width: 250,
        borderRadius: 5,
        borderWidth: 2,
        backgroundColor: colors.dark_item,
        borderColor: colors.accents,
        justifyContent: "center",
      }}
    >
      <TextInput
        value={filter}
        onChangeText={setFilter}
        placeholder="Search"
        style={{
          color: colors.accents,
          fontFamily: "Roboto-Regular",
          textAlign: "center",
          fontSize: 20,
          outline: "none",
        }}
        onKeyPress={(e) => {
          if (e.keyCode === 27) setFilter("");
        }}
      />
      {!filter || (
        <Pressable
          style={{ position: "absolute", alignSelf: "flex-end" }}
          onPress={() => {
            setFilter("");
          }}
        >
          <AntDesign name="close" size={24} color={colors.accents} />
        </Pressable>
      )}
    </View>
  );
}
