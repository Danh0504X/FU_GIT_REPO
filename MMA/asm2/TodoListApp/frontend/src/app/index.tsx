import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";

import { getCredentials, isValidCredentials } from "../storage/authStorage";

// Màn hình khởi động: kiểm tra thông tin đăng nhập đã lưu (auto-login)
export default function StartScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    getCredentials()
      .then((credentials) => {
        setIsLoggedIn(
          credentials !== null && isValidCredentials(credentials)
        );
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Redirect href={isLoggedIn ? "/home" : "/login"} />;
}
