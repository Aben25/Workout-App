import 'react-native-url-polyfill/auto';
import * as React from 'react';
import { supabase } from '../lib/supabase';

// Create a React Context to provide Supabase client throughout the app
const SupabaseContext = React.createContext(null);

// Provider component that wraps your app and makes Supabase client available to any child component
export function SupabaseProvider({ children }) {
  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
}

// Hook for components to get access to the Supabase client
export function useSupabase() {
  const context = React.useContext(SupabaseContext);
  if (context === null) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}
