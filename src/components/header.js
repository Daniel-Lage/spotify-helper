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
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      }}
    >
      {children}
    </View>
  );
}
