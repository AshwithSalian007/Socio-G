import {Text, View, StyleSheet, TouchableOpacity, ImageBackground, useColorScheme, Image} from 'react-native';
import { APP_NAME } from '../../../constants'; 

export default function SuccessScreen1({navigation, route}){
    const isDarkMode = useColorScheme() === 'dark';
    const bgImg = isDarkMode? require('../../../../assets/login-bg-dark.png'): require('../../../../assets/login-bg-light.png');


    



    
    return(
        <>
        <ImageBackground source={bgImg} style={styles.mainBox} resizeMode='cover'>
            <View>

            <Text style={styles.greetTxt}>Welcome to {APP_NAME}, {route.params && route.params.name? route.params.name : ''}!</Text>
            <View style={styles.msgBx}>
                <Text style={styles.messages}>
                    Congratulations on joining our community! 🌟 {'\n'} 
                    We're thrilled to have you on board.
                </Text>
                <Text style={styles.messages}>
                Start exploring, connecting with friends, and sharing your experiences | 🚀 Feel free to personalize your profile and dive into conversations in our vibrant community.
                </Text>
                <Text style={styles.messages}>
                    If you have any questions or need assistance, don't hesitate to reach out.
                </Text>
                <Text style={styles.messages}>
                Once again, welcome to {APP_NAME}! Let's make some memories together! 📸✨
                </Text>
            </View>
            </View>

            <View style={styles.nxtCntn}>

                <TouchableOpacity style={styles.nxtbtnImg} onPress={()=>{navigation.navigate('SuccessScreen2')}}>
                    <Image
                        style={styles.nxtbtnImg}
                        source={require('./../../../../assets/right-arrow-icon.png')}
                    />
                </TouchableOpacity>
            </View>
            
        </ImageBackground>
        </>
    );
}

const styles = StyleSheet.create({
    mainBox:{
        flex:1,
        paddingVertical:100,
        position:'relative',
        paddingHorizontal:15,
        justifyContent:'space-between'
    },
    msgBx:{
        marginHorizontal:6
    },
    greetTxt:{
        color:'#fff',
        fontSize:32,
        fontWeight:'bold',
        marginBottom:25
    },
    messages:{
        color:'#999',
        marginTop:20
    },
    nxtCntn:{
        flexDirection:'row',
        justifyContent:'flex-end',
        paddingRight:10
    },
    nxtbtn:{
        padding:10,
        width:50,
        height:50,
        alignSelf:'flex-end'
    },
    nxtbtnImg:{
        tintColor:'#fff',
        width:35,
        height:35
        
    }
});