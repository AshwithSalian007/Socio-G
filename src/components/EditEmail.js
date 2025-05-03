import { useState } from "react";
import { ActivityIndicator, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import axiosInstance from "../config/axiosConfig";

export default function EditEmail({navigation}){
    const [isVerified, setIsVerified] = useState(false);
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleVerify = async() => {
        if(isLoading){
            return;
        }
        if(!password){
            setErrorMsg("Password field cannot be emtpy");
            return;
        }
        setErrorMsg('');
        setIsLoading(true);
        try {
            const response = await axiosInstance.post('api/auth/verify', {password});
            if(response.status == 200){
                setIsVerified(true);
            }
        } catch (error){
            if(error.response && error.response.data && error.response.data.message){
                setErrorMsg(error.response.data.message);
            } else {
                setErrorMsg(error.message);
            }
        }
        setIsLoading(false);
    }

    if(!isVerified){
        return(
            <View style={styles.mainContainer}>
                <Text style={styles.verifyTitleTxt}>Verify its you</Text>
                <TextInput 
                style={styles.passwordInput}
                placeholder="Enter Password"
                placeholderTextColor='#444'
                value={password}
                onChangeText={(text)=>{setPassword(text)}}
                maxLength={64}
                autoCapitalize='none'
                secureTextEntry
                />
                {errorMsg && <Text style={{color:'#f00', marginHorizontal:15}}>{errorMsg}</Text>}
                <TouchableOpacity style={styles.verifyBtn} onPress={handleVerify}>
                    {
                        isLoading ?
                        <ActivityIndicator size={'small'} color='#fff' />
                        :
                        <Text style={{color:'#fff', fontSize:18, fontWeight:'500'}}>Verify</Text>
                    }
                </TouchableOpacity>
            </View>
        )
    }

    return(
        <View style={styles.mainContainer}>

        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer:{
        flex:1,
        backgroundColor:'#000',
        paddingTop: StatusBar.currentHeight || 40,
        justifyContent:'center'
    },
    verifyTitleTxt:{
        color:'#fff',
        textAlign:'center',
        fontSize:24
    },
    passwordInput:{
        fontSize:16,
        paddingHorizontal:10,
        paddingVertical:5,
        borderWidth:2,
        color:'#ccc',
        borderColor:'#292929',
        marginTop:15,
        marginHorizontal:15
    },
    verifyBtn:{
        backgroundColor:'#1f5eff',
        paddingVertical:8,
        justifyContent:'center',
        alignItems:'center',
        marginHorizontal:15,
        marginBottom:80,
        marginTop:20
    }
})