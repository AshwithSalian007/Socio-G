import React from 'react';
import {StyleSheet, View, StatusBar, useColorScheme} from 'react-native';
import { navigationRef} from './src/utils/NavigationUtils';
import Profile from './src/components/Profile';
import Home from './src/components/Home';
import Login from './src/components/Login';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import SignupPage1 from './src/components/Signup/SignupPage1';
import SignupPage2 from './src/components/Signup/SignupPage2';
import PlatformIndependentDatePicker from './src/components/DatePick';
import SuccessScreen1 from './src/components/Signup/registerSuccessScreens/SuccessScreen1';
import SuccessScreen2 from './src/components/Signup/registerSuccessScreens/SuccessScreen2';
import AuthVerify from './src/verification/AuthVerify';
import EditProfile from './src/components/EditProfile';
import FindUsers from './src/components/FindUsers';
import UserProfile from './src/components/UserProfile';
import FollowingList from './src/components/FollowingList';
import FollowerList from './src/components/FollowerList';
import AddPost from './src/components/AddPost';
import Location from './src/components/Location';
import ShareLocation from './src/components/ShareLocation';
import MenuPage from './src/components/MenuPage';
import CommentPage from './src/components/CommentPage';
import AiChatHome from './src/components/AiChatHome';
import AiChatScreen from './src/components/AiChatScreen';
import ReportPage from './src/components/ReportPage';
import Toast from 'react-native-toast-message';
import EditEmail from './src/components/EditEmail';
import NotificationPage from './src/components/NotificationPage';













const Stack = createStackNavigator();








export default function App() {
  
  const isDarkMode = useColorScheme() === 'dark';
  StatusBar.setBarStyle(isDarkMode?'light-content':'dark-content');
  StatusBar.setBackgroundColor('#000000c0');
  
  

  

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator 
      screenOptions={{
          animationEnabled: false, // Disable animation
        }}
      initialRouteName='AuthVerify'
      >
        <Stack.Screen name="AuthVerify" component={AuthVerify} options={{headerShown:false}}/>
        <Stack.Screen name="DatePicker" component={PlatformIndependentDatePicker} options={{headerShown:false}}/>
        <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
        <Stack.Screen name="Signup" component={SignupPage1} options={{headerShown:false}}/>
        <Stack.Screen name="home" component={Home} options={{headerShown:false}}/>
        <Stack.Screen name="SignupNext" component={SignupPage2} options={{headerShown:false}}/>
        <Stack.Screen name="SuccessScreen1" component={SuccessScreen1} options={{headerShown:false}}/>
        <Stack.Screen name="SuccessScreen2" component={SuccessScreen2} options={{headerShown:false, ...TransitionPresets.SlideFromRightIOS, animationEnabled:true}}/>
        <Stack.Screen name="Profile" component={Profile} options={{headerShown:false}}/>
        <Stack.Screen name="EditProfile" component={EditProfile} options={{headerShown:false}}/>
        <Stack.Screen name="FindUser" component={FindUsers} options={{headerShown:false}}/>
        <Stack.Screen name='UserProfile' component={UserProfile} options={{headerShown:false}}/>
        <Stack.Screen name='FollowingList' component={FollowingList} options={{headerShown:false}}/>
        <Stack.Screen name='FollowerList' component={FollowerList} options={{headerShown:false}}/>
        <Stack.Screen name='addPost' component={AddPost} options={{headerShown:false}}/>
        <Stack.Screen name='location' component={Location} options={{headerShown:false}}/>
        <Stack.Screen name='shareLocation' component={ShareLocation} options={{headerShown:false}}/>
        <Stack.Screen name='menu' component={MenuPage} options={{headerShown:false}}/>
        <Stack.Screen name='comment' component={CommentPage} options={{headerShown:false}}/>
        <Stack.Screen name='aiChatHome' component={AiChatHome} options={{headerShown:false}}/>
        <Stack.Screen name='aiChatScreen' component={AiChatScreen} options={{headerShown:false}}/>
        <Stack.Screen name='report' component={ReportPage} options={{headerShown:false}}/>
        <Stack.Screen name='editEmail' component={EditEmail} options={{headerShown:false}}/>
        <Stack.Screen name='notification' component={NotificationPage} options={{headerShown:false}}/>



      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    
  },
  mainContainerColorLight:{
    backgroundColor:'#ffffff',
  },
  mainContainerColorDark:{
    backgroundColor:'#000000',
  },
  mainContainer: {
    height: '100%',
    backgroundColor:'#ffffff'
  }
});
