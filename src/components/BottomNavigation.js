import { View, Text, StyleSheet, Dimensions, StatusBar, Image, TouchableOpacity } from "react-native";
import {navigate} from '../utils/NavigationUtils'

export default function BottomNavigation({activePage, componentHightSetter}){
    // activePage = 'home', 'FindUser', 'reel',  'Profile' 
    const { height: screenNativeHeight } = Dimensions.get('screen');
    const windowNativeHeight = Dimensions.get('window').height;;
    const heightDifference = screenNativeHeight - windowNativeHeight;
    const navigationBarHeight = heightDifference - StatusBar.currentHeight;
    const hasNavigationBar = navigationBarHeight > 0;

    const containerBottomPadding =  hasNavigationBar ? (navigationBarHeight > 30? 5 : 35 - navigationBarHeight) : 35;

    const handleLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        if(componentHightSetter){
            componentHightSetter(height);
        }
    }
    
    return(
        <View style={[styles.mainContainer, {paddingBottom: containerBottomPadding}]} onLayout={handleLayout}>
            <TouchableOpacity style={styles.navBtns} onPress={()=>{activePage != 'home' ? navigate('home') : null}}>
                <Image
                source={require('./../../assets/nav-home-icon.png')}
                style={styles.navIcons}
                />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navBtns} onPress={()=>{activePage != 'FindUser' ? navigate('FindUser') : null}}>
                <Image
                source={require('./../../assets/nav-search-icon.png')}
                style={styles.navIcons}
                />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navBtns} onPress={()=>{activePage != 'addPost' ? navigate('addPost') : null}}>
                <Image
                source={require('./../../assets/nav-add-icon.png')}
                style={styles.addIcon}
                />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navBtns} onPress={()=>{activePage != 'location' ? navigate('location') : null}}>
                <Image
                source={require('./../../assets/nav-location-icon.png')}
                style={styles.navIcons}
                />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navBtns} onPress={()=>{activePage != 'Profile' ? navigate('Profile') : null}}>
                <Image
                source={require('./../../assets/nav-profile-icon.png')}
                style={styles.navIcons}
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer:{
        borderTopColor:'#222',
        borderTopWidth:0.5,
        backgroundColor:'#000',
        position:'absolute',
        left:0,
        right:0,
        bottom:0,
        paddingTop:5,
        flexDirection:'row',
        justifyContent:'space-around'
    },
    navBtns:{
        padding:10
    },
    navIcons:{
        tintColor:"#ddd",
        width:24,
        height:24
    },
    addIcon:{
        tintColor:'#1f7eff',
        width:24,
        height:24
    }
})