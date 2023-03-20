import { View } from "react-native";

export default function Header({ colors, children }) {
  return (
    <View
      style={{
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primary,
        gap: 10,
        width: "100%",
        paddingHorizontal: 10,
        zIndex: 3,
        shadowOpacity: 0.3,
        shadowRadius: 15,
      }}
    >
      {children}
    </View>
  );
}
