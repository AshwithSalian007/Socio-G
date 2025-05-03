import { useEffect, useState } from 'react';
import {Text, View, StyleSheet, TouchableOpacity, TextInput, ImageBackground, ActivityIndicator, useColorScheme, Image, StatusBar, KeyboardAvoidingView, ScrollView, Alert, Platform} from 'react-native';
import { BASE_URL } from '../../constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignupPage2({navigation, route}){
    const isDarkMode = useColorScheme() === 'dark';
    const bgImg = isDarkMode? require('../../../assets/login-bg-dark.png'): require('../../../assets/login-bg-light.png');
    const placeHolderColor = isDarkMode? '#444444' : '#bbb';

    const [loading, setLoading] = useState(false);

    //form handling
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const [passwordLengthWarning, setPasswordLengthWarning] = useState('');



    //flag
    useEffect(()=>{
        setIsMounted(true);
    },[]);

    //validate for every change in input value
    useEffect(()=>{
        if(isMounted){
            validateUsername();
        }
    }, [username]);

    useEffect(()=>{
        if(isMounted){
            validatePassword();
        }
    }, [password]);

    useEffect(()=>{
        if(isMounted){
            validateConfirmPassword();
        }
    }, [confirmPassword]);


    
    //validate input
    const validateUsername = () => {
        if(!username){
            setUsernameError('Username is required');
        }
        else if(username.includes(' ')){
            setUsernameError('Username cannot contain space. use _ or .');
        }
        else if(!/^[a-zA-Z0-9_.]*$/.test(username)){
            setUsernameError('Only letters, numbers, _ and . are allowed.');
        }
        else if(username.length < 4){
            setUsernameError('Username must be at least 4 characters long');
        }
        else {
            setUsernameError('');
            return true;
        }
        return false;
    }

    const validatePassword = () => {
        if(!password){
            setPasswordError('Password is required')
        }
        else if(password.length < 8){
            setPasswordError('Password must be at least 8 characters long')
        }
        else {
            setPasswordError('')
            return true;
        }
        return false;

        
    }

    const validateConfirmPassword = () => {
        if(confirmPassword !== password){
            setConfirmPasswordError('Passwords do not match');
        } else {
            setConfirmPasswordError('');
            return true;
        }
        return false;

    }



    //handle input
    const handleUsernameChange = (inputText) => {
        const Text = inputText.toLowerCase();
        // Check if input text contains spaces
        if (Text.includes(' ')) {
            // If space is found, show error message  
            setUsernameError('Username cannot contain space. use _ or .');
        }
        else if(!/^[a-zA-Z0-9_.]*$/.test(Text)){
            setUsernameError('Only letters, numbers, _ and . are allowed.');
        }
        else {
            // If no space, update input text
            setUsername(Text);
        }
    }

    const handlePasswordChange = (Text) => {
        if(Text.length >= 60){
            setPasswordLengthWarning('Warning: password limit ' + password.length + '/64');
        } else {
            setPasswordLengthWarning('');
        }
        setPassword(Text);
    }

    const handleConfirmPasswordChange = (Text) => {
        setConfirmPassword(Text);
    }

    const onSubmit = async() => {
        setFormSubmitted(true);
        setLoading(true);
        if(usernameError || passwordError || confirmPasswordError){
            setLoading(false);
            setFormSubmitted(false);
            return;
        }

        if(!(validateUsername() && validatePassword() && validateConfirmPassword())){
            setLoading(false);
            setFormSubmitted(false);
            return;
        }

        

        const {name, email, phone, dob} = route.params;
        const values = {
            name:name,
            email:email.toLowerCase(),
            mobileNumber:phone,
            dateOfBirth:dob,
            username:username.toLowerCase(),
            password:password
        }
        try {
            const axiosInstance = axios.create({
                baseURL:`${BASE_URL}`,
                timeout:15000,
            });

            const result = await axiosInstance.post('/api/auth/register', values);
            if(result.status === 201){
                if(result.data.message){
                    try {
                        const response = await axiosInstance.post('/api/auth/login', {username:username.toLowerCase(), password:password});
                        if(response.status === 200){
                            if(response.data && response.data.token && response.data.uid){
                                 await AsyncStorage.setItem('token', response.data.token);
                                 await AsyncStorage.setItem('uid', response.data.uid);  
                            }
                        }
                    } catch (error) {}
                    navigation.reset({
                        index: 0,
                        routes: [{ 
                          name: 'SuccessScreen1',
                          params: {name:name}
                        }],
                      });
                } else {
                    // console.log(result);
                    alert('Something went wrong');
                }
            } else if(result.status && result.data.message){
                Alert.alert(result.status.toString(), result.data.message);
            } else if(result.status) {
                Alert.alert('Server '+result.status.toString(), "Unknown Response");
            }
        } catch (error) {
            if(error.response && error.response.status == 409 && error.response.data.message){
                setUsernameError(error.response.data.message);
            } 
            else if(error.response && error.response.data && error.response.data.message){
                Alert.alert('Error:', error.response.data.message);
            }
            else {
                Alert.alert('Error:', error.message);
            }
        }
        
        setLoading(false);
        setFormSubmitted(false);
    }


    

    

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
            <TouchableOpacity style={styles.backBtn} onPress={()=>{navigation.goBack()}}>
                <Image
                    style={styles.backBtn_icon}
                    source={require('../../../assets/left-back-icon.png')}
                />
            </TouchableOpacity>
        
      
            <View style={[styles.container]}>
            <ScrollView>
            <Text style={[styles.txtsignup, dynamicStyle.txtcl1]}>Sign Up</Text>
            
            <View>
                <Text style={[styles.txtLabel, dynamicStyle.txxtcl2]}>Username</Text>
                <TextInput 
                    style={[styles.txtInput, dynamicStyle.txtcl1, dynamicStyle.brdrcl1]} 
                    placeholder='Username' 
                    placeholderTextColor={placeHolderColor} 
                    maxLength={30} 
                    autoCapitalize='none'
                    value={username} 
                    onChangeText={handleUsernameChange}
                />
                {usernameError? <Text style={styles.errorTxtMessage}>{usernameError}</Text>:null}
            </View>
            <View>
                <Text style={[styles.txtLabel, dynamicStyle.txxtcl2]}>Create Password</Text>
                <TextInput 
                    style={[styles.txtInput, dynamicStyle.txtcl1, dynamicStyle.brdrcl1]} 
                    placeholder='Create Password' 
                    placeholderTextColor={placeHolderColor}
                    autoCapitalize='none'
                    maxLength={64}
                    value={password}
                    onChangeText={handlePasswordChange}
                    secureTextEntry
                />
                {passwordError? <Text style={styles.errorTxtMessage}>{passwordError}</Text>:null}
                {passwordLengthWarning? <Text style={styles.warningTxtMessage}>{passwordLengthWarning}</Text>:null}
            </View>
            <View>
                <Text style={[styles.txtLabel, dynamicStyle.txxtcl2]}>Confirm Password</Text>
                <TextInput 
                    style={[styles.txtInput, dynamicStyle.txtcl1, dynamicStyle.brdrcl1]} 
                    placeholder='Confirm Password' 
                    placeholderTextColor={placeHolderColor}
                    autoCapitalize='none'
                    maxLength={64}
                    value={confirmPassword}
                    onChangeText={handleConfirmPasswordChange}
                    secureTextEntry
                />
                {confirmPasswordError? <Text style={styles.errorTxtMessage}>{confirmPasswordError}</Text>:null}
            </View>
            
            <View style={styles.nextBtnContn}>
            <TouchableOpacity 
                style={[styles.nextBtn, {backgroundColor: formSubmitted? '#777' : styles.nextBtn.backgroundColor}]}
                disabled={formSubmitted}
                onPress={onSubmit}
            >
                <Text style={styles.txtNextBtn}>Create</Text>
            </TouchableOpacity>
            </View>
            </ScrollView>
            </View>
            {loading && <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#0000ff" /></View>}
        </ImageBackground>
        </>
    );
}

const styles = StyleSheet.create({
    mainBox:{
        flex:1,
        justifyContent:'center',
        position:'relative'
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
    backBtn:{
        position:'absolute',
        // backgroundColor:'#fff',
        top: (StatusBar.currentHeight || 40),
        left:10,
        padding:3
    },
    backBtn_icon: {
        width:26,
        height:26,
        tintColor:'#fff'
    },
    container:{
        paddingVertical:10,
        paddingHorizontal:25
    },
    txtsignup: {
        fontSize:38,
        fontWeight:'bold',
        marginBottom:20,
        textAlign:'center',
        
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
    warningTxtMessage:{
        color:'#ff0'
    },
    nextBtnContn:{
        marginTop:50,
        marginBottom:30
    },
    nextBtn:{
        backgroundColor:'#1f7eff',
        padding:8,
        borderRadius:20,
        
    },
    txtNextBtn:{
        color:'#ffffff',
        fontWeight:'bold',
        fontSize:18,
        textAlign:'center',
    }
});