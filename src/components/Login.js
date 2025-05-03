import { useState } from 'react';
import {Text, View, StyleSheet, TouchableOpacity, TextInput, ImageBackground, useColorScheme, StatusBar, KeyboardAvoidingView, ScrollView, ActivityIndicator, Alert, Platform} from 'react-native';
import { BASE_URL } from '../constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({navigation}){
    const isDarkMode = useColorScheme() === 'dark';
    const bgImg = isDarkMode? require('../../assets/login-bg-dark.png'): require('../../assets/login-bg-light.png');
    const placeHolderColor = isDarkMode? '#444444' : '#bbb';

    //form data
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [formSubmit, setFormSubmit] = useState(false);
    const [loading, setLoading] = useState(false);

    const validateUsername = (text) => {
        if(!/^[a-zA-Z0-9_.]*$/.test(text)){
            setUsernameError('Only letters, numbers, _ and . are allowed.');
            return false;
        }
        else if(!text){
            setUsernameError('username is required.');
            return false;
        }
        else {
            setUsernameError('');
            return true;
        }
    }


    const handleUsernameChange = (Text) => {
        setUsername(Text);
    }

    const handlePasswordChange = (Text) => {
        setPassword(Text);
    }

    const onLoginSubmit = async() => {
        setFormSubmit(true);
        setLoading(true);
        setPasswordError('');
        setUsernameError('');
        if(!validateUsername(username.trim())){
            setLoading(false);
            setFormSubmit(false);
            return;
        }

        if(!password){
            setPasswordError('Password is required');
            setLoading(false);
            setFormSubmit(false);
            return;
        }

        const value = {
            username:username.toLowerCase().trim(),
            password:password
        }
        
        try {
            const axiosInstance = axios.create({
                baseURL:`${BASE_URL}`,
                timeout:15000,
            });
            const result = await axiosInstance.post('/api/auth/login', value);
            if(result.status === 200){
                if(result.data && result.data.token && result.data.uid){
                     await AsyncStorage.setItem('token', result.data.token);
                     await AsyncStorage.setItem('uid', result.data.uid);
                     navigation.reset({
                        index: 0,
                        routes: [{ 
                          name: 'home'
                        }],
                      });
                } else {
                    Alert.alert('Oops! Something went wrong.');
                }
            }
        } catch (error) {
            if(error.response){
                if(error.response.status === 404 && error.response.data &&  error.response.data.message){
                    setUsernameError(error.response.data.message);
                } 
                else if(error.response.status === 401 && error.response.data && error.response.data.message){
                    setPasswordError(error.response.data.message);
                }
                else if(error.response.data && error.response.data.message){
                    Alert.alert('Error:', error.response.data.message);
                }
                else {
                    Alert.alert('Error:', error.message);
                }
            } else if(error.request){
                Alert.alert('Error:', error.message);
            } else {
                Alert.alert('Error:', error.message);
            }
        }



        setLoading(false);
        setFormSubmit(false);
    }




    

    //for status bar
    // StatusBar.setBackgroundColor(isDarkMode?'#000000':'#ffffff');
    // StatusBar.setBarStyle(isDarkMode?'light-content':'dark-content');
    
    const dynamicStyle = StyleSheet.create({
        txtcl1:{
            color:isDarkMode? '#ffffff' : '#000000',
        },
        txxtcl2:{
            color:isDarkMode? '#aaaaaa' : '#565656',
        },
        brdrcl1:{
            borderColor:isDarkMode? '#aaaaaa' : '#565656',
        }
    });

    
    return(
        <>
        
        <ImageBackground source={bgImg} style={[styles.mainBox]} resizeMode='cover'>
        
      
            <View style={[styles.container]}>
            <ScrollView>
            <Text style={[styles.txtLogin, dynamicStyle.txtcl1]}>Login</Text>
            <View style={styles.bxDontSignUp}>
            <Text style={[styles.txtDontact, dynamicStyle.txxtcl2]}> Dont have a account ? </Text>
            <TouchableOpacity style={{padding:0}} onPress={()=>{navigation.replace('Signup')}}><Text style={[styles.btnCreateNew, dynamicStyle.txtcl1]}>Create new</Text></TouchableOpacity>
            </View>
            <View>
                <Text style={[styles.txtLabel, dynamicStyle.txxtcl2]}>Username</Text>
                <TextInput 
                    style={[styles.txtInput, dynamicStyle.txtcl1, dynamicStyle.brdrcl1]} 
                    placeholder='username' 
                    placeholderTextColor={placeHolderColor}
                    maxLength={30}
                    autoCapitalize='none'
                    value={username}
                    onChangeText={handleUsernameChange}
                    />
                {usernameError && <Text style={styles.errorTxtMessage}>{usernameError}</Text>}
            </View>
            <View>
                <Text style={[styles.txtLabel, dynamicStyle.txxtcl2]}>Password</Text>
                <TextInput 
                    style={[styles.txtInput, dynamicStyle.txtcl1, dynamicStyle.brdrcl1]} 
                    placeholder='Password' 
                    placeholderTextColor={placeHolderColor} 
                    value={password}
                    maxLength={64}
                    autoCapitalize='none'
                    onChangeText={handlePasswordChange}
                    secureTextEntry
                />
                {passwordError && <Text style={styles.errorTxtMessage}>{passwordError}</Text>}
            </View>
            <View style={styles.loginBtnContn}>
            <TouchableOpacity 
            style={styles.loginBtn}
            onPress={onLoginSubmit}
            disabled={formSubmit}
            >
                <Text style={styles.txtLoginBtn}>Login</Text>
            </TouchableOpacity>
            </View>
            </ScrollView>
            </View>
            {loading && <View style={styles.loadingContainer}><ActivityIndicator style={styles.loading} size="large" color="#0000ff" /></View>}
        </ImageBackground>
        </>
    );

    
}

const styles = StyleSheet.create({
    mainBox:{
        flex:1,
        justifyContent:'center',

    },
    container:{
        paddingVertical:10,
        paddingHorizontal:25,
    },
    loadingContainer:{
        position:'absolute',
        top:0,
        left:0,
        width:'100%',
        height:'100%',
        backgroundColor:'#000000dd',
        justifyContent:'center',
        alignItems:'center'
    },
    txtLogin: {
        fontSize:38,
        fontWeight:'bold',
        marginTop:0,
        textAlign:'center',
        
    },
    bxDontSignUp:{
        marginTop:15,
        display:'flex',
        flexDirection:'row',
        marginBottom:45,
        justifyContent:'center'
    },
    txtDontact:{
        fontWeight:'500'
    },
    btnCreateNew:{
        fontWeight:'600'
    },
    txtLabel:{
        marginBottom:3,
        marginTop:20
    },
    txtInput:{
        borderWidth:2,
        borderRadius:15,
        paddingHorizontal:12,
        paddingVertical:(Platform.OS == 'ios'?10:5),
    },
    errorTxtMessage:{
        color:'#f00'
    },
    
    loginBtnContn:{
        marginTop:50,
        marginBottom:50
    },
    loginBtn:{
        backgroundColor:'#1f7eff',
        padding:8,
        borderRadius:20,
        
    },
    txtLoginBtn:{
        color:'#ffffff',
        fontWeight:'bold',
        fontSize:18,
        textAlign:'center',
    }
});
