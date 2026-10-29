import { StyleSheet } from "react-native";

// Style dùng chung cho màn hình Login và Register
export const authStyles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#F4F8EC",
  },

  appName: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2E7D32",
  },

  subtitle: {
    textAlign: "center",
    color: "#666666",
    marginTop: 4,
    marginBottom: 25,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12,
  },

  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#aaaaaa",
    paddingVertical: 8,
    fontSize: 16,
  },

  primaryButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 13,
    borderRadius: 5,
    marginTop: 25,
    alignItems: "center",
  },

  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  link: {
    marginTop: 18,
    alignItems: "center",
  },

  linkText: {
    color: "#555555",
  },

  linkTextBold: {
    color: "#1E88E5",
    fontWeight: "bold",
  },

  serverInfo: {
    textAlign: "center",
    color: "#999999",
    fontSize: 12,
    marginTop: 20,
  },

});
