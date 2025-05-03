import { useEffect, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Text, View, StyleSheet, TouchableOpacity, TextInput, ImageBackground, useColorScheme, StatusBar, KeyboardAvoidingView, ScrollView, Platform} from 'react-native';

export default function SignupPage1({navigation}){
    const isDarkMode = useColorScheme() === 'dark';

    const bgImg = isDarkMode? require('../../../assets/login-bg-dark.png'): require('../../../assets/login-bg-light.png');
    const placeHolderColor = isDarkMode? '#444444' : '#bbb';

    //form handle
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');

    
    //validate
    const validateName = (name) => {
        const namePattern = /^[a-zA-Z0-9_\s.]*$/;
        
        return namePattern.test(name);
    }

    // Validate email format
    const validateEmail = (email) => {
        // Regular expression for validating email address
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        // Test the email against the pattern
        return emailPattern.test(email);
    }

    // Function to validate Indian mobile phone number
    const validateIndianPhoneNumber = (phoneNumber) => {
        // Regular expression for validating Indian mobile phone number
        const phonePattern = /^[6789]\d{9}$/; // Starts with 6, 7, 8, or 9 and followed by 9 digits
    
        // Test the phone number against the pattern
        return phonePattern.test(phoneNumber);
    }

    //handle change
    const handleNameChange = (Text) => {
        setName(Text);
    }

    const handleEmailChange = (Text) => {
        setEmail(Text);
    }

    const handlePhoneChange = (Text) => {
        setPhone(Text);
    }

    const onSubmitNext = () => {
        setNameError('');
        setEmailError('');
        setPhoneError('');

        if(!validateName(name)){
            setNameError('Name connot contain special character. you can use _ and .');
            return;
        } else if(!name){
            setNameError('Name is required');
            return;
        }
        if(!email){
            setEmailError('Email is required');
            return;
        } else if(!validateEmail(email)){
            setEmailError('Invalid email address');
            return;
        }
        if(!phone){
            setPhoneError('Phone Number is required');
            return;
        } else if(!validateIndianPhoneNumber(phone)){
            setPhoneError('Invalid Indian mobile phone number');
            return;
        }
        //if everything is valid move to next page
        navigation.navigate('SignupNext', { name:name, email:email, phone:phone, dob:selectedDate.toLocaleDateString('en-GB')});
    }


    //for date picker
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDateChange = (event, date) =>{
        // console.log(event['type']);
        // console.log(date);
        setShowDatePicker(false);
        setSelectedDate(date);
        setShowDatePicker(Platform.OS === 'ios');
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
        {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display='spinner'
          maximumDate={new Date()}
          onChange={handleDateChange}
        />
      )}
      
            <View style={[styles.container]}>
            <ScrollView>
            <Text style={[styles.txtsignup, dynamicStyle.txtcl1]}>Sign Up</Text>
            <View style={styles.bxAlrdySignIn}>
            <Text style={[styles.txtalrdyact, dynamicStyle.txxtcl2]}> Already have a account ? </Text>
            <TouchableOpacity style={{padding:0}} onPress={()=>{navigation.replace('Login')}}>
                <Text style={[styles.btnSignin, dynamicStyle.txtcl1]}>Sign in</Text>
            </TouchableOpacity>
            </View>
            <View>
                <Text style={[styles.txtLabel, dynamicStyle.txxtcl2]}>Name</Text>
                <TextInput 
                    style={[styles.txtInput, dynamicStyle.txtcl1, dynamicStyle.brdrcl1]} 
                    placeholder='Name' 
                    placeholderTextColor={placeHolderColor}
                    maxLength={64}
                    autoCapitalize='none'
                    value={name}
                    onChangeText={handleNameChange}
                />
                {nameError? <Text style={styles.errorTxtMessage}>{nameError}</Text>:null}
            </View>
            <View>
                <Text style={[styles.txtLabel, dynamicStyle.txxtcl2]}>Email</Text>
                <TextInput 
                    style={[styles.txtInput, dynamicStyle.txtcl1, dynamicStyle.brdrcl1]} 
                    placeholder='Email' 
                    placeholderTextColor={placeHolderColor}
                    autoCapitalize='none'
                    maxLength={254}
                    value={email}
                    onChangeText={handleEmailChange}
                />
                {emailError? <Text style={styles.errorTxtMessage}>{emailError}</Text>:null}
            </View>
            <View>
                <Text style={[styles.txtLabel, dynamicStyle.txxtcl2]}>Phone Number</Text>
                <View style={[styles.txtInput, dynamicStyle.brdrcl1, styles.phnNumberBox]}>
                    <Text style={[styles.phn91, dynamicStyle.txtcl1, dynamicStyle.brdrcl1]}>+91</Text>
                    <TextInput 
                        style={[dynamicStyle.txtcl1, styles.phnInput]} 
                        placeholder='0000000000' 
                        placeholderTextColor={placeHolderColor}
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={handlePhoneChange}
                        />
                </View>
                {phoneError? <Text style={styles.errorTxtMessage}>{phoneError}</Text>:null}
            </View>
            <View>
                <Text style={[styles.txtLabel, dynamicStyle.txxtcl2]}>Date of Birth</Text>
                <TouchableOpacity onPress={()=>{setShowDatePicker(true)}}>
                    <TextInput 
                        editable={false} 
                        style={[styles.txtInput, dynamicStyle.txtcl1, dynamicStyle.brdrcl1]} 
                        value={selectedDate.toLocaleDateString('en-GB')}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.nextBtnContn}>
            <TouchableOpacity style={styles.nextBtn} onPress={onSubmitNext}><Text style={styles.txtNextBtn}>Next</Text></TouchableOpacity>
            </View>
            </ScrollView>
            </View>
        </ImageBackground>
        </>
    );
}

const styles = StyleSheet.create({
    mainBox:{
        flex:1,
    },
    container:{
        paddingVertical:10,
        paddingHorizontal:25
    },
    txtsignup: {
        fontSize:38,
        fontWeight:'bold',
        marginTop:50,
        textAlign:'center',
        
    },
    bxAlrdySignIn:{
        marginTop:15,
        display:'flex',
        flexDirection:'row',
        marginBottom:25,
        justifyContent:'center'
    },
    txtalrdyact:{
        fontWeight:'500'
    },
    btnSignin:{
        fontWeight:'800'
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
    phnNumberBox:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
    },
    phn91:{
        marginRight:5,
        paddingRight:5,
        borderRightWidth:2
    },
    phnInput:{
        flex:1
        
    },
    nextBtnContn:{
        marginTop:40,
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