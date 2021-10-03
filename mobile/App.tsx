import React, { Suspense } from 'react'
import { RelayEnvironmentProvider } from 'react-relay/hooks'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NativeBaseProvider, Spinner } from 'native-base'
import HomeScreen from './src/Screens/Home'
import RelayEnvironment from './src/RelayEnvironment'
import BookDetailScreen from './src/Screens/BookDetail'
import { Screens } from './src/lib/navigation'

const Stack = createNativeStackNavigator()

function App() {
  return (
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <NativeBaseProvider>
        <Suspense fallback={<Spinner size={40} marginTop={50}></Spinner>}>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name={Screens.HomeScreen} component={HomeScreen} />
              <Stack.Screen
                name={Screens.BookDetailScreen}
                component={BookDetailScreen}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </Suspense>
      </NativeBaseProvider>
    </RelayEnvironmentProvider>
  )
}

export default App
