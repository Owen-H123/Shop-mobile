import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, TextInput, View } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  ZoomIn,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppLoadingScreen } from "@/presentation/components/app-loading-screen";
import { ThemedText } from "@/presentation/components/themed-text";
import { useAuth } from "@/presentation/hooks/use-auth";

const SPLASH_DURATION = 1200;

const DEMO_CREDENTIALS = [
  {
    rol: "ADMIN",
    label: "Admin",
    usuario: "admin",
    password: "admin123",
    icon: "shield-checkmark-outline" as const,
  },
  {
    rol: "VENDEDOR",
    label: "Vendedor",
    usuario: "vendedor",
    password: "vendedor123",
    icon: "storefront-outline" as const,
  },
];

/** Orbe translúcido que flota lentamente en el fondo, da profundidad sin sobrecargar la vista. */
function FloatingOrb({
  size,
  top,
  left,
  right,
  delay,
  duration,
  travel,
  opacity,
}: {
  size: number;
  top?: number;
  left?: number;
  right?: number;
  delay: number;
  duration: number;
  travel: number;
  opacity: number;
}) {
  const offset = useSharedValue(0);

  useEffect(() => {
    offset.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      ),
    );
  }, [delay, duration, offset]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: offset.value * -travel },
      { translateX: offset.value * (travel / 2) },
    ],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          top,
          left,
          right,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: "#ffffff",
          opacity,
        },
        style,
      ]}
    />
  );
}

type AnimatedFieldProps = {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secure?: boolean;
  editable?: boolean;
  hasError?: boolean;
  onSubmitEditing?: () => void;
  returnKeyType?: "next" | "done";
  inputRef?: React.RefObject<TextInput | null>;
};

/** Campo de texto con borde animado al enfocar y toggle de contraseña. */
function AnimatedField({
  icon,
  value,
  onChangeText,
  placeholder,
  secure,
  editable = true,
  hasError,
  onSubmitEditing,
  returnKeyType = "done",
  inputRef,
}: AnimatedFieldProps) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const focusProgress = useSharedValue(0);

  useEffect(() => {
    focusProgress.value = withTiming(focused ? 1 : 0, { duration: 180 });
  }, [focused, focusProgress]);

  const containerStyle = useAnimatedStyle(() => ({
    borderColor: hasError
      ? "#DC2626"
      : focusProgress.value > 0.5
        ? "#F35744"
        : "#E5E7EB",
    backgroundColor:
      focusProgress.value > 0
        ? `rgba(243, 87, 68, ${0.035 * focusProgress.value})`
        : "transparent",
  }));

  return (
    <Animated.View
      style={containerStyle}
      className="flex-row items-center gap-3 rounded-2xl border px-4 py-3.5"
    >
      <Ionicons name={icon} size={19} color={focused ? "#F35744" : "#9CA3AF"} />
      <TextInput
        ref={inputRef}
        className="flex-1 text-base text-black"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        autoCapitalize="none"
        autoCorrect={false}
        editable={editable}
        secureTextEntry={secure && !showPassword}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onSubmitEditing={onSubmitEditing}
        returnKeyType={returnKeyType}
      />
      {secure && (
        <Pressable onPress={() => setShowPassword((prev) => !prev)} hitSlop={8}>
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={19}
            color="#9CA3AF"
          />
        </Pressable>
      )}
    </Animated.View>
  );
}

export function LoginScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [selectedRol, setSelectedRol] = useState<string | null>(null);
  const { usuarioActual, checkingSesion, submitting, error, login } = useAuth();

  const shakeX = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const passwordInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setShowSplash(false), SPLASH_DURATION);
    return () => clearTimeout(timeout);
  }, []);

  // Si ya existe una sesión guardada en SQLite, no pedimos login de nuevo.
  useEffect(() => {
    if (!checkingSesion && usuarioActual) {
      router.replace(usuarioActual.rol === "ADMIN" ? "/admin" : "/pedidos");
    }
  }, [checkingSesion, usuarioActual]);

  // Sacudida sutil cuando el login falla; refuerza el error sin ser exagerada.
  useEffect(() => {
    if (error) {
      shakeX.value = withSequence(
        withTiming(-6, { duration: 55 }),
        withTiming(6, { duration: 55 }),
        withTiming(-4, { duration: 55 }),
        withTiming(0, { duration: 55 }),
      );
    }
  }, [error, shakeX]);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  async function handleIngresar() {
    await login(usuario, contrasena);
  }

  function fillCredentials(cred: (typeof DEMO_CREDENTIALS)[number]) {
    setSelectedRol(cred.rol);
    setUsuario(cred.usuario);
    setContrasena(cred.password);
  }

  if (showSplash || checkingSesion) {
    return <AppLoadingScreen />;
  }

  return (
    <SafeAreaView className="flex-1 bg-brand">
      {/* Orbes flotantes decorativos, sutiles */}
      <FloatingOrb
        size={220}
        top={-60}
        right={-70}
        delay={0}
        duration={4200}
        travel={14}
        opacity={0.1}
      />
      <FloatingOrb
        size={140}
        top={90}
        left={-50}
        delay={500}
        duration={3600}
        travel={10}
        opacity={0.08}
      />
      <FloatingOrb
        size={90}
        top={210}
        right={40}
        delay={250}
        duration={3000}
        travel={8}
        opacity={0.1}
      />

      <Animated.View
        entering={FadeInDown.duration(350)}
        className="flex-row items-center gap-2 px-6 pt-2"
      >
        <View className="h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white">
          <Image
            source={require("@/assets/images/icono.jpg")}
            style={{ width: 32, height: 32 }}
            contentFit="cover"
          />
        </View>
        <ThemedText className="text-lg font-bold text-white">
          Shop Mobile
        </ThemedText>
      </Animated.View>

      <View className="items-center py-8">
        <Animated.View
          entering={ZoomIn.delay(100).springify().damping(14).mass(0.8)}
          className="h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-white shadow-lg"
        >
          <Image
            source={require("@/assets/images/icono.jpg")}
            style={{ width: 96, height: 96 }}
            contentFit="cover"
          />
        </Animated.View>
      </View>

      <Animated.View
        entering={FadeInUp.delay(150)
          .duration(420)
          .easing(Easing.out(Easing.cubic))}
        className="flex-1 rounded-t-[40px] bg-white px-8 pb-8 pt-10 shadow-2xl"
      >
        <Animated.View
          entering={FadeInUp.delay(220).duration(350)}
          className="gap-1"
        >
          <ThemedText className="text-center text-2xl font-bold text-black">
            Ingresar
          </ThemedText>
          <ThemedText className="text-center text-sm text-muted">
            Gestión de pedidos para tu emprendimiento
          </ThemedText>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(280).duration(350)}
          className="gap-3 pt-7"
        >
          <Animated.View style={shakeStyle} className="gap-3">
            <AnimatedField
              icon="person-outline"
              value={usuario}
              onChangeText={(text) => {
                setUsuario(text);
                setSelectedRol(null);
              }}
              placeholder="Usuario"
              editable={!submitting}
              hasError={!!error}
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current?.focus()}
            />
            <AnimatedField
              icon="lock-closed-outline"
              value={contrasena}
              onChangeText={(text) => {
                setContrasena(text);
                setSelectedRol(null);
              }}
              placeholder="Contraseña"
              secure
              editable={!submitting}
              hasError={!!error}
              onSubmitEditing={handleIngresar}
              inputRef={passwordInputRef}
            />
          </Animated.View>
        </Animated.View>

        {error && (
          <Animated.View
            entering={FadeInDown.duration(180)}
            className="flex-row items-center gap-1.5 pt-3"
          >
            <Ionicons name="alert-circle" size={16} color="#DC2626" />
            <ThemedText className="text-sm text-red-600">{error}</ThemedText>
          </Animated.View>
        )}

        <Animated.View
          entering={FadeInUp.delay(340).duration(350)}
          className="mt-8 items-center"
        >
          <Pressable
            onPress={handleIngresar}
            onPressIn={() => {
              buttonScale.value = withSpring(0.96, { damping: 14 });
            }}
            onPressOut={() => {
              buttonScale.value = withSpring(1, { damping: 12 });
            }}
            disabled={submitting}
          >
            <Animated.View
              style={buttonStyle}
              className="min-w-40 items-center rounded-full bg-black px-8 py-3.5 shadow-lg"
            >
              {submitting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <View className="flex-row items-center gap-2">
                  <ThemedText className="font-semibold text-white">
                    Ingresar
                  </ThemedText>
                  <Ionicons name="arrow-forward" size={16} color="#ffffff" />
                </View>
              )}
            </Animated.View>
          </Pressable>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(400).duration(350)}
          className="mt-6 gap-2.5"
        >
          <ThemedText className="text-center text-xs text-muted">
            Credenciales de prueba
          </ThemedText>
          <View className="flex-row justify-center gap-3">
            {DEMO_CREDENTIALS.map((cred) => {
              const isSelected = selectedRol === cred.rol;
              return (
                <Pressable
                  key={cred.rol}
                  onPress={() => fillCredentials(cred)}
                  disabled={submitting}
                  className="active:opacity-70"
                >
                  <View
                    className={`flex-row items-center gap-1.5 rounded-full border px-3.5 py-2 ${
                      isSelected
                        ? "border-brand bg-brand/5"
                        : "border-surface-selected bg-surface-selected/40"
                    }`}
                  >
                    <Ionicons
                      name={cred.icon}
                      size={14}
                      color={isSelected ? "#F35744" : "#6B7280"}
                    />
                    <ThemedText
                      className={`text-xs ${isSelected ? "font-semibold text-brand" : "text-muted"}`}
                    >
                      {cred.label}
                    </ThemedText>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
}
