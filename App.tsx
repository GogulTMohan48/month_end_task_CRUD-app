// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import First from './src/First';
// import Task from './src/Task';
// import Last from './src/Last';
// import { Provider } from 'react-redux';
// import store from './src/redux/store';

// const Stack = createStackNavigator();

// export default function App() {
//   return (
//     <Provider store={store}>
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="First">
//         <Stack.Screen name="First" component={First}  options={{ headerShown: false }} />
//         <Stack.Screen name="Task" component={Task}  options={{ headerShown: false }} />
//         <Stack.Screen name="Last" component={Last}  options={{ headerShown: false }} /> 
//       </Stack.Navigator>
//     </NavigationContainer>
//     </Provider>
//   );
// }

// 
// 
// 
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector, Provider, useDispatch } from 'react-redux';
import First from './src/First';
import Task from './src/Task';
import Last, { taskCountSelector } from './src/Last';
import store, { RootState } from './src/redux/store';
import { initializeTasks } from './src/redux/tasksSlice';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const taskCount = useSelector(taskCountSelector);

  useEffect(() => {
    const initialize = async () => {
      await dispatch(initializeTasks());
      setIsLoading(false);
    };
    initialize();
  }, [dispatch]);

  if (isLoading) {
    return null; 
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={taskCount > 0 ? "Last" : "First"}>
        <Stack.Screen name="First" component={First} options={{ headerShown: false }} />
        <Stack.Screen name="Task" component={Task} options={{ headerShown: false }} />
        <Stack.Screen name="Last" component={Last} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};

export default App;
