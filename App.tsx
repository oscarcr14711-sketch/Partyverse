import { useEffect } from 'react';
import AppNavigator from './AppNavigator';
import { initializeSounds } from './utils/SoundManager';

export default function App() {
  useEffect(() => {
    console.log('📱 App.tsx: useEffect running...');
    console.log('📱 App.tsx: Calling initializeSounds()...');
    initializeSounds()
      .then(() => {
        console.log('📱 App.tsx: initializeSounds() completed successfully');
      })
      .catch((err) => {
        console.error('📱 App.tsx: initializeSounds() failed:', err);
      });
  }, []);

  return <AppNavigator />;
}
