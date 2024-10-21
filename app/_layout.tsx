import { Stack, useRouter } from "expo-router";
import { AuthProvider, useAuth } from "./authContext";
import { useEffect } from "react";

function RootLayout() {
  const { isLoggedIn } = useAuth(); // Get logged-in status
  const router = useRouter();

  useEffect(() => {
    // Redirect based on login status
    if (!isLoggedIn) {
      // If not logged in, redirect to login screen
      router.replace("/login");
    } else {
      // If logged in, redirect to index
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
