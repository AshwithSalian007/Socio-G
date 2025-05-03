import { useEffect, useState } from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import axiosInstance from "../config/axiosConfig";
import { TouchableOpacity } from "react-native-gesture-handler";



export default function AuthVerify({navigation}){
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    const Authenticate = async() => {
        setErrorMsg('');
        setIsLoading(true);
        try {
            const response = await axiosInstance.get('/api/auth/');
            setIsLoading(false);
            if(response.status === 200){
                navigation.replace('home');
            } else {
                navigation.replace('Login');
            }
        } catch (error) {
            setIsLoading(false);
            if(error.response){
                if(error.response.data && error.response.data.message){
                    setErrorMsg(error.response.data.message);
                } else {
                    setErrorMsg(error.response.status + error.message);
                }
            } else if(error.request){
                setErrorMsg(error.message);
            }
        }
    }

    useEffect(()=>{
        Authenticate();
    }, [])



    return(
        <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#333'}}>
            {isLoading && <ActivityIndicator size="large" color="#ffffff" />}
            {errorMsg && <Text style={styles.errorTxt}>{errorMsg}</Text>}
            {isLoading || 
            <TouchableOpacity style={styles.retryBtn} onPress={()=>{Authenticate()}}>
                <Text style={styles.retryTxt}>Retry</Text>
            </TouchableOpacity>}
        </View>
    )
}

const styles = StyleSheet.create({
    errorTxt:{
        color:'#ffffff',
        fontSize:18,
        padding:10
    },
    retryBtn:{
        backgroundColor:'#00d0ff',
        paddingVertical:10,
        paddingHorizontal:15,
        borderRadius:15,
        marginVertical:20
    },
    retryTxt:{
        fontSize:18,
        fontWeight:'700',
    }
});