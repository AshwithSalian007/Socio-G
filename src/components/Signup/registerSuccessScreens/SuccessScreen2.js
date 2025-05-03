import { View, Text, StyleSheet, StatusBar, ImageBackground, TouchableOpacity } from "react-native";
import { reset } from "../../../utils/NavigationUtils";



export default function SuccessScreen2({navigation}){
    return(
        <>
        <ImageBackground source={require('./../../../../assets/happy-kid.jpg')} style={styles.mainImageBox} resizeMode='cover'>
            <View style={styles.blackShadowBox}>
            </View>
                <Text style={styles.quoteTxt}> Join our vibrant community and start building meaningful connections today. Whether it's sharing laughs, swapping stories, or simply being there for each other, this is the place where friendships flourish. Click below to start connecting now</Text>
                <TouchableOpacity 
                    style={styles.getstrtdBtn} 
                    activeOpacity={0.7} 
                    onPress={()=>{
                        reset('home');
                    }}
                    >
                    <Text style={styles.getstrtdBtnTxt}>Get Sarted</Text>
                </TouchableOpacity>
        </ImageBackground>
        </>
    );
}
const styles = StyleSheet.create({
    mainImageBox:{
        flex:1,
        paddingTop: StatusBar.currentHeight || 40,
        paddingHorizontal:20,
        justifyContent:'space-between',
        paddingBottom:50
    },
    blackShadowBox:{
        backgroundColor:'#000',
        opacity:0.65,
        position:'absolute',
        top:0,
        left:0,
        bottom:0,
        right:0
    },
    quoteTxt:{
        color:'#ddd',
        fontWeight:'bold',
        fontSize:25,
        padding:10,
        lineHeight:38,
        marginTop:40,
        textAlign:'center'
    },
    getstrtdBtn:{
        backgroundColor:'#1f7eff',
        paddingVertical:14,
        paddingHorizontal:20,
        borderRadius:30
    },
    getstrtdBtnTxt:{
        color:'#fff',
        fontSize:21,
        fontWeight:'700',
        textAlign:'center',
    }
});