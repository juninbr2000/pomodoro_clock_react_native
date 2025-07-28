import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  const theme = useColorScheme();
  const isDark = theme === "dark";

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Início", headerShown: false }}
      />
      <Stack.Screen
        name="Customization"
        options={{
          title: "Personalizar",
          headerStyle: {
            backgroundColor: isDark ? "#2f2f2f" : "#f2f2f2",
          },
          headerTitleStyle: {
            color: isDark ? "#fff" : "#000",
          },
          headerTintColor: isDark ? "#fff" : "#000", 
        }}
      />
    </Stack>
  );
}