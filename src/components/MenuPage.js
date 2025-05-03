import { TouchableOpacity, View, Text, StatusBar, StyleSheet, Alert } from "react-native";
import { logout } from "../utils/Functions";

export default function MenuPage({navigation}) {
    return (
        <View style={styles.mainContainer}>
            <Text style={styles.mainTopTxt}>MENU</Text>
            
            {/* <TouchableOpacity style={styles.navigationBtns} onPress={()=>{navigation.navigate('editEmail')}}>
                <Text style={{color:'#fff', textAlign:'center'}}>Change Email</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navigationBtns} onPress={async()=>{}}>
                <Text style={{color:'#fff', textAlign:'center'}}>Change Password</Text>
            </TouchableOpacity> */}

            <TouchableOpacity 
            style={styles.navigationBtns} 
            onPress={()=>{
                Alert.alert(
                    'Logout',
                    'Are you sure you want to logout?',
                    [
                    {
                        text: 'Cancel',
                        onPress: () => {
                        // Handle cancel action if needed
                        },
                        style: 'cancel',
                    },
                    {
                        text: 'Logout',
                        onPress: async() => {
                            await logout();
                        },
                    },
                    ],
                    { cancelable: false }
                );
            }}
            >
                <Text style={{color:'#fff', textAlign:'center'}}>Logout</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer:{
        flex:1,
        backgroundColor:'#252525',
    },
    mainTopTxt:{
        color:'#fff',
        fontSize:28,
        fontWeight:'600',
        textAlign:'center',
        paddingBottom:10,
        paddingTop: (StatusBar.currentHeight || 40) + 10,
        backgroundColor:'#000',
        marginBottom:15
    },
    navigationBtns:{
        padding:15, 
        backgroundColor:'#000', 
        marginVertical:5
    }
})