import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";

import { useAuth } from "../context/AuthContext";
import { authStyles } from "./authStyles";

// Khớp với điều kiện kiểm tra ở backend (auth.service.ts)
const MIN_USERNAME_LENGTH = 3;
const MIN_PASSWORD_LENGTH = 6;

export default function RegisterScreen() {
  const { register, login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const goToLogin = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/login");
    }
  };

  // Kiểm tra trước ở app để báo lỗi nhanh, server vẫn kiểm tra lại
  const validate = () => {
    if (username.trim().length < MIN_USERNAME_LENGTH) {
      return `Username phải có ít nhất ${MIN_USERNAME_LENGTH} ký tự.`;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return `Password phải có ít nhất ${MIN_PASSWORD_LENGTH} ký tự.`;
    }
    if (password !== confirmPassword) {
      return "Password nhập lại không khớp.";
    }
    return null;
  };

  const handleRegister = async () => {
    const errorMessage = validate();
    if (errorMessage) {
      Alert.alert("Đăng ký thất bại", errorMessage);
      return;
    }

    setIsSubmitting(true);
    try {
      await register(username, password);
      // Đăng ký xong thì đăng nhập luôn (không ghi nhớ), Stack.Protected tự chuyển sang Home
      await login(username, password, false);
    } catch (error) {
      Alert.alert(
        "Đăng ký thất bại",
        error instanceof Error ? error.message : "Đã có lỗi xảy ra."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={authStyles.container}>

      <Text style={authStyles.appName}>TODOLIST</Text>
      <Text style={authStyles.subtitle}>Tạo tài khoản mới</Text>

      <View style={authStyles.card}>

        <Text style={authStyles.title}>Đăng ký</Text>

        <Text style={authStyles.label}>Username:</Text>

        <TextInput
          style={authStyles.input}
          placeholder={`Ít nhất ${MIN_USERNAME_LENGTH} ký tự`}
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
          editable={!isSubmitting}
        />

        <Text style={authStyles.label}>Password:</Text>

        <TextInput
          style={authStyles.input}
          placeholder={`Ít nhất ${MIN_PASSWORD_LENGTH} ký tự`}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!isSubmitting}
        />

        <Text style={authStyles.label}>Nhập lại Password:</Text>

        <TextInput
          style={authStyles.input}
          placeholder="Nhập lại password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          editable={!isSubmitting}
        />

        <TouchableOpacity
          style={[authStyles.primaryButton, isSubmitting && authStyles.buttonDisabled]}
          onPress={handleRegister}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={authStyles.primaryButtonText}>REGISTER</Text>
          )}
        </TouchableOpacity>

      </View>

      <TouchableOpacity
        style={authStyles.link}
        onPress={goToLogin}
        disabled={isSubmitting}
      >
        <Text style={authStyles.linkText}>
          Đã có tài khoản?{" "}
          <Text style={authStyles.linkTextBold}>Đăng nhập</Text>
        </Text>
      </TouchableOpacity>

    </View>
  );
}
