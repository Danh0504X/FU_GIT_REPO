import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";

import { API_URL } from "../config/api";
import { DEMO_ACCOUNT } from "../config/demoAccount";
import { useAuth } from "../context/AuthContext";
import { authStyles } from "./authStyles";

export default function LoginScreen() {
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberPassword, setRememberPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Server kiểm tra username/password; thành công thì Stack.Protected tự chuyển sang Home
  const submitLogin = async (loginUsername: string, loginPassword: string) => {
    setIsSubmitting(true);
    try {
      await login(loginUsername, loginPassword, rememberPassword);
    } catch (error) {
      Alert.alert(
        "Đăng nhập thất bại",
        error instanceof Error ? error.message : "Đã có lỗi xảy ra."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = () => {
    if (username.trim() === "" || password.trim() === "") {
      Alert.alert("Đăng nhập thất bại", "Vui lòng nhập Username và Password.");
      return;
    }
    submitLogin(username, password);
  };

  const handleQuickLogin = () => {
    setUsername(DEMO_ACCOUNT.username);
    setPassword(DEMO_ACCOUNT.password);
    submitLogin(DEMO_ACCOUNT.username, DEMO_ACCOUNT.password);
  };

  return (
    <View style={authStyles.container}>

      <Text style={authStyles.appName}>TODOLIST</Text>
      <Text style={authStyles.subtitle}>Quản lý công việc mỗi ngày</Text>

      <View style={authStyles.card}>

        <Text style={authStyles.title}>Đăng nhập</Text>

        <Text style={authStyles.label}>Username:</Text>

        <TextInput
          style={authStyles.input}
          placeholder="Nhập username"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
          editable={!isSubmitting}
        />

        <Text style={authStyles.label}>Password:</Text>

        <TextInput
          style={authStyles.input}
          placeholder="Nhập password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!isSubmitting}
        />

        <TouchableOpacity
          style={styles.rememberRow}
          onPress={() => setRememberPassword(!rememberPassword)}
          disabled={isSubmitting}
        >
          <View
            style={[
              styles.checkbox,
              rememberPassword && styles.checkboxChecked,
            ]}
          >
            {rememberPassword && (
              <Text style={styles.checkText}>✓</Text>
            )}
          </View>

          <Text>Remember Password</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[authStyles.primaryButton, isSubmitting && authStyles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={authStyles.primaryButtonText}>LOGIN</Text>
          )}
        </TouchableOpacity>

        {/* Chỉ hiện khi chạy development (Expo Go / expo start), bản build release sẽ ẩn */}
        {__DEV__ && (
          <>
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>hoặc</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={[styles.quickButton, isSubmitting && authStyles.buttonDisabled]}
              onPress={handleQuickLogin}
              disabled={isSubmitting}
            >
              <Text style={styles.quickButtonText}>
                ⚡ Đăng nhập nhanh ({DEMO_ACCOUNT.username})
              </Text>
            </TouchableOpacity>
          </>
        )}

      </View>

      <TouchableOpacity
        style={authStyles.link}
        onPress={() => router.push("/register")}
        disabled={isSubmitting}
      >
        <Text style={authStyles.linkText}>
          Chưa có tài khoản?{" "}
          <Text style={authStyles.linkTextBold}>Đăng ký</Text>
        </Text>
      </TouchableOpacity>

      {__DEV__ && (
        <Text style={authStyles.serverInfo}>Server: {API_URL}</Text>
      )}

    </View>
  );
}

const styles = StyleSheet.create({

  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#777777",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxChecked: {
    backgroundColor: "#222222",
  },

  checkText: {
    color: "#ffffff",
    fontWeight: "bold",
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#dddddd",
  },

  dividerText: {
    marginHorizontal: 10,
    color: "#999999",
  },

  quickButton: {
    borderWidth: 1.5,
    borderColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 15,
    alignItems: "center",
  },

  quickButtonText: {
    color: "#2E7D32",
    fontWeight: "bold",
  },

});
