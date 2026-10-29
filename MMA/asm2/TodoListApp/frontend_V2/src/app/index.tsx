import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";

import { useAuth } from "../context/AuthContext";

// Màn hình khởi động: chờ AuthContext kiểm tra token đã lưu (auto-login) rồi chuyển hướng
export default function StartScreen() {
  const { status } = useAuth();

  if (status === "loading") {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Redirect href={status === "signedIn" ? "/home" : "/login"} />;
}
