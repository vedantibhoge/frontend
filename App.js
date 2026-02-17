import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TeacherMaindashboard from "./Screens/Teacher/teachermain"

import LoginScreen from "./Screens/Login/Login";
import StudentMain from "./Screens/Students/StudentMain"; // adjust path

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="StudentMain" component={StudentMain} />
          <Stack.Screen name="TeacherMaindashboard" component={TeacherMaindashboard} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}