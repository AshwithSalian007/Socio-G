import { useEffect, useState } from "react";
import { ActivityIndicator, View, Text, Image, FlatList, TouchableOpacity, StyleSheet, StatusBar, TextInput } from "react-native";
import axiosInstance from "../config/axiosConfig";
import { getRandomUUID } from "../utils/Functions";




export default function FollowingList({navigation, route}) {
    const {username} = route.params;
    
    const [followingUserData, setFollowingUserData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState('');
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [filteredUserData, setFilteredUserData] = useState([]);

    useEffect(()=>{
        const fetchFollowingList = async(userId="") => {
            setFetchError('');
            setIsLoading(true);
            setIsDataLoaded(false);
            try {
                const response = await axiosInstance.get(`api/user/get/following/${userId}`);
                if(response.data){
                    setFollowingUserData(response.data);
                    setFilteredUserData(response.data);
                    setIsDataLoaded(true);
                }
            } catch (error) {
                if(error.response && error.response.data && error.response.data.message){
                    setFetchError(error.response.data.message);
                } else {
                    setFetchError(error.message);
                }
            }
            setIsLoading(false);
        }
        if(route.params && route.params.uid){
            fetchFollowingList(route.params.uid);
        } else {
            fetchFollowingList();
        }
        
    }, [route.params]);

    const dataLoadingAnimation = () => {
        return(
            <View style={styles.loadingContainer}>
                {isLoading && <ActivityIndicator size='large' color='#ffffff'/>}
                {fetchError && <Text style={{color:'#ffffff'}}>{fetchError}</Text>}
            </View>
        );
    }


    const renderUsers = ({item}) => {
        return(
            <TouchableOpacity style={styles.userContainer} onPress={()=>{navigation.push('UserProfile', {key: getRandomUUID(), uid:item.uid})}}>
                <View style={styles.profileCntainer}>
                    <Image
                        source={item.profile ? {uri: item.profile} : require('./../../assets/profile-default.png')}
                        style={styles.profileImage}
                    />
                    <View style={styles.detailsContainer}>
                        <Text style={{color:'#fff'}}>{item.username}{item.isVerified && <Image source={require('./../../assets/verified-icon.png')} style={{width:20, height:20}}/>}</Text>
                        <Text style={{color:'#fff'}}>{item.name}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
    const handleSearch = async(text) => {
        if(!text){
            setFilteredUserData(followingUserData);
            return;
        }
        const filteredList = followingUserData.filter(user => user.username.includes(text.toLowerCase()));
        setFilteredUserData(filteredList);
    }

    const serachComponent = () => {
        return (
            <>
            <View style={styles.searchBox}>
                <TextInput style={styles.searchInput} onChangeText={handleSearch} autoCapitalize="none" placeholder="Search" placeholderTextColor='#888'></TextInput>
            </View>
            </>
        )
    }


    const DisplayLoadedData = () => {
        return (
            <>
                <FlatList
                    ListHeaderComponent={serachComponent()}
                    data={filteredUserData}
                    renderItem={renderUsers}
                    ListEmptyComponent={<Text style={{color:'#dddddd', textAlign:'center', padding:10}}>No user found</Text>}
                />
            </>
        );
    }

    return(
        <>
        <View style={styles.mainContainer}>
        <View style={styles.topBox}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                <TouchableOpacity onPress={()=>{navigation.goBack()}}>
                    <Image
                    source={require('./../../assets/left-back-icon.png')}
                    style={styles.backBtnIcon}
                    />
                </TouchableOpacity>
                <Text style={styles.username}>{route.params? username : ''}</Text>
                </View>
            </View>
            {isDataLoaded || dataLoadingAnimation()}
            {isDataLoaded && DisplayLoadedData()}
        </View>
        </>
    );

}



const styles = StyleSheet.create({
    mainContainer:{
        paddingTop: StatusBar.currentHeight || 40,
        flex: 1,
        backgroundColor:'#000'
    },
    topBox:{
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:25,
        paddingVertical:10
    },
    backBtnIcon:{
        width:24,
        height:24,
        tintColor:'#fff',
        marginRight:22
    },
    username:{
        fontSize:22,
        fontWeight:'500',
        textTransform:'lowercase',
        color:'#fff',
        paddingBottom:5
    },
    loadingContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    searchBox:{
        marginHorizontal:15,
        paddingTop: 5,
        paddingBottom:10,
        borderBottomWidth:1,
        borderBottomColor:'#333'
    },
    searchInput:{
        backgroundColor:'#252525',
        color:'#cccccc',
        paddingHorizontal:15,
        paddingVertical:3,
        fontSize:16,
        borderRadius:14
    },
    userContainer:{
        // backgroundColor:'#444',
        paddingHorizontal:10,
        paddingVertical:10,
        marginTop:2
    },
    profileCntainer:{
        flexDirection:'row'
    },
    detailsContainer:{
        paddingLeft:10,
        justifyContent:'center'
    },
    profileImage:{
        width:60,
        height:60,
        borderRadius:30
    }
});