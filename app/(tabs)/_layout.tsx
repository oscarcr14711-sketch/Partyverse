import { Tabs } from 'expo-router';
import React from 'react';
import CustomBottomMenu from '../../components/CustomBottomMenu';

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen name="home" />
        <Tabs.Screen name="games" />
        <Tabs.Screen name="store" />
        <Tabs.Screen name="profile" />
      </Tabs>
      {/* <CustomBottomMenu /> */}
    </>
  );
}
