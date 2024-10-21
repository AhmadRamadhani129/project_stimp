import { Stack, useRouter } from "expo-router";
import { AuthProvider, useAuth } from "./authContext";
import { useEffect } from "react";

function RootLayout() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    } else {
      router.replace("/drawer");
    }
  }, [isLoggedIn]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="drawer" options={{ headerShown: false }} />
      <Stack.Screen name="game" options={{ title: "Play Game" }} />
      <Stack.Screen name="/drawer/highscore" options={{ title: "Highscore" }} />
      <Stack.Screen name="result" options={{ title:"Result" }} />
    </Stack>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  );
}
