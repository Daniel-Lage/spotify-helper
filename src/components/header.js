import { View } from "react-native";

export default function Header({ colors, children }) {
  return (
    <View
      style={{
        alignItems: "center",
        height: "10vh",
        justifyContent: "center",
        backgroundColor: colors.primary,
        width: "100vw",
        paddingLeft: "2vw",
        paddingRight: "2vw",
        position: "fixed",
        zIndex: 1,
        shadowOpacity: 0.4,
        shadowRadius: 15,
      }}
    >
      {children}
    </View>
  );
}
