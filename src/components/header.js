import { View } from "react-native";

export default function Header({ colors, children }) {
  return (
    <View
      style={{
        height: "10vh",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primary,
        width: "100vw",
        paddingLeft: "2vw",
        paddingRight: "2vw",
        zIndex: 1,
        shadowOpacity: 0.3,
        shadowRadius: 15,
      }}
    >
      {children}
    </View>
  );
}
