import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";

import {
  clearCredentials,
  isValidCredentials,
  saveCredentials,
} from "../storage/authStorage";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberPassword, setRememberPassword] = useState(false);

  const handleLogin = async () => {
    const credentials = { username, password };

    if (!isValidCredentials(credentials)) {
      Alert.alert("Đăng nhập thất bại", "Vui lòng nhập Username và Password.");
      return;
    }

    // Có tick "Remember Password" thì lưu lại để lần sau tự đăng nhập,
    // không tick thì xoá thông tin cũ (nếu có)
    if (rememberPassword) {
      await saveCredentials(credentials);
    } else {
      await clearCredentials();
    }

    router.replace("/home");
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        LOGIN
      </Text>

      <Text style={styles.label}>Username:</Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập username"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />

      <Text style={styles.label}>Password:</Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.rememberRow}
        onPress={() => setRememberPassword(!rememberPassword)}
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
        style={styles.loginButton}
        onPress={handleLogin}
      >
        <Text style={styles.loginButtonText}>LOGIN</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
  },

  title: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },

  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#aaaaaa",
    paddingVertical: 8,
    fontSize: 16,
  },

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

  loginButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 13,
    borderRadius: 5,
    marginTop: 25,
    alignItems: "center",
  },

  loginButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },

});
