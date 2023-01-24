import { ActivityIndicator, View } from "react-native";
import Colors from "../colors";

export default function Load({ theme }) {
  const colors = Colors(theme);
  console.log(theme);
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.background,
      }}
    >
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
