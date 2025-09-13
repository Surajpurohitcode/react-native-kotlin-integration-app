import LottieView from 'lottie-react-native';
import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ToastAndroid,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Logo from "../src/assets/react_native_ic.svg";
import { Result } from "../src/types/Result"; // ✅ make sure this matches your file path

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const [loginState, setLoginState] = useState<Result<null>>({ status: "loading" });

  const isFormValid = useMemo(
    () => email.trim().length > 0 && password.trim().length > 0,
    [email, password]
  );

  // Check if user is already logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const loggedIn = await AsyncStorage.getItem("@logged_in");
        if (loggedIn === "true") {
          setLoginState({ status: "success", data: null });
          navigation.reset({
            index: 0,
            routes: [{ name: "List" }],
          });
          navigation.replace("List");
        } else {
          setLoginState({ status: "success", data: null });
        }
      } catch (e) {
        setLoginState({ status: "error", error: "Failed to check login" });
      }
    };
    checkLoggedIn();
  }, [navigation]);

  const handleLogin = useCallback(async () => {
    if (!isFormValid) return;

    setLoginState({ status: "loading" });

    try {
      if (email !== "admin@test.com" || password !== "test@456") {
        setLoginState({ status: "error", error: "Invalid email or password" });
        ToastAndroid.show("Invalid email or password", ToastAndroid.SHORT);
      } else {
        await AsyncStorage.setItem("@logged_in", "true"); // save logged-in flag
        setLoginState({ status: "success", data: null });
        ToastAndroid.show("Welcome Back!", ToastAndroid.SHORT);
        navigation.replace("List");
      }
    } catch (e) {
      setLoginState({ status: "error", error: "Login failed. Try again." });
      ToastAndroid.show("Login failed. Try again.", ToastAndroid.SHORT);
    }
  }, [email, password, isFormValid, navigation]);

  if (loginState.status === "loading") {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          source={require('../src/assets/animations/loading.json')}
          autoPlay
          loop
          style={{ width: 350, height: 350 }}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Logo width={56} height={56} />
            </View>
            <Text style={styles.appTitle}>React Native</Text>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.subtitleText}>Sign in to your account</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <View
                style={[
                  styles.inputWrapper,
                  isEmailFocused && styles.inputWrapperFocused,
                ]}
              >
                <Text
                  style={[
                    styles.inputLabel,
                    (isEmailFocused || email.length > 0) && styles.inputLabelActive,
                    isEmailFocused && styles.inputLabelFocused,
                  ]}
                >
                  Email Address
                </Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={setEmail}
                  value={email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <View
                style={[
                  styles.inputWrapper,
                  isPasswordFocused && styles.inputWrapperFocused,
                ]}
              >
                <Text
                  style={[
                    styles.inputLabel,
                    (isPasswordFocused || password.length > 0) &&
                    styles.inputLabelActive,
                    isPasswordFocused && styles.inputLabelFocused,
                  ]}
                >
                  Password
                </Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={setPassword}
                  value={password}
                  secureTextEntry={true}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="password"
                  textContentType="password"
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                />
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                isFormValid
                  ? styles.loginButtonActive
                  : styles.loginButtonInactive,
              ]}
              onPress={handleLogin}
              disabled={!isFormValid}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.loginButtonText,
                  isFormValid
                    ? styles.loginButtonTextActive
                    : styles.loginButtonTextInactive,
                ]}
              >
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 40 },
  header: { alignItems: "center", paddingTop: 40, paddingHorizontal: 32, paddingBottom: 32 },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  appTitle: { fontSize: 18, fontWeight: "600", color: "#374151", marginBottom: 8 },
  welcomeText: { fontSize: 28, fontWeight: "700", color: "#111827", marginBottom: 6 },
  subtitleText: { fontSize: 15, color: "#6B7280", textAlign: "center" },
  formContainer: { paddingHorizontal: 32, paddingTop: 16 },
  inputGroup: { marginBottom: 20 },
  inputWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    position: "relative",
    minHeight: 56,
  },
  inputWrapperFocused: { borderColor: "#3B82F6", borderWidth: 2 },
  inputLabel: { position: "absolute", left: 16, top: 18, fontSize: 16, color: "#9CA3AF", fontWeight: "400", zIndex: 1 },
  inputLabelActive: { top: 8, fontSize: 12, color: "#6B7280", fontWeight: "500", backgroundColor: "#FFFFFF", paddingHorizontal: 4 },
  inputLabelFocused: { color: "#3B82F6" },
  textInput: { fontSize: 16, color: "#111827", fontWeight: "400", paddingTop: 4, minHeight: 20 },
  loginButton: { borderRadius: 12, paddingVertical: 16, alignItems: "center", justifyContent: "center", marginTop: 24, minHeight: 52 },
  loginButtonInactive: { backgroundColor: "#F9FAFB", borderWidth: 1, borderColor: "#E5E7EB" },
  loginButtonActive: { backgroundColor: "#3B82F6", shadowColor: "#3B82F6", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  loginButtonText: { fontSize: 16, fontWeight: "600" },
  loginButtonTextInactive: { color: "#9CA3AF" },
  loginButtonTextActive: { color: "#FFFFFF" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FAFAFA" }, // ✅ added missing style
});
