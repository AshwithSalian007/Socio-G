import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, StatusBar, ActivityIndicator, Image, TouchableOpacity, FlatList, TextInput } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../config/axiosConfig";
import BottomNavigation from "./BottomNavigation";
import { getRandomUUID } from "../utils/Functions";

export default function FindUsers({navigation}){
    const [selfUID, setSelfUID] = useState(null);
    const [bottomNavigationHeight, setBottomNavigationHeight] = useState(0);
    
    const [isDataLoaded, setIsDataLoaded] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState('');
    const [placeHolderColor, setPlaceHolderColor] = useState('#aaaaaa');
    const [recentSearchUserID, setRecentSearchUserID] = useState([]);
    const [initialUsers, setInitialUsers] = useState([]);


    const [searchText, setSearchText] = useState('');
    
    const [userDataList, SetUserDataList] = useState([]);

    const searchUsers = async() => {
        setFetchError('');
        if(!searchText){
            SetUserDataList(initialUsers);
            setIsDataLoaded(true);
            return;
        }
        
        setIsLoading(true);
        setIsDataLoaded(false);
        try {
            const response = await axiosInstance.get(`api/user/search/${searchText.toLowerCase()}`);
            if(response.data){
                if(response.data.length == 0){
                    setFetchError('No user Found');
                } else {
                    SetUserDataList(response.data);
                    setIsDataLoaded(true);
                }
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

    useEffect(()=>{
        const addUserToLocalStorage = async() => {
            try {
                await AsyncStorage.setItem(selfUID + 'recentSearch', JSON.stringify(recentSearchUserID));
            } catch (error) {}
        }
        if(recentSearchUserID.length > 0 && selfUID != null){
            addUserToLocalStorage();
        }
    }, [recentSearchUserID]);

    useEffect(()=> {
        const  getRecentUserID = async() => {
            try {
                const selfUserID = await AsyncStorage.getItem('uid');
                setSelfUID(selfUserID);
                const uidList  = await AsyncStorage.getItem(selfUserID + 'recentSearch');
                if(uidList !== null){
                    setRecentSearchUserID(JSON.parse(uidList));
                }
            } catch (error) {
                setRecentSearchUserID([]);
            }
        }
        getRecentUserID();

       
    }, [])

    useEffect(()=>{
        const getUserInfo = async(uid) => {
            try {
                const result = await axiosInstance.get(`api/user/profile/${uid}`);
                if(result.status === 200 && result.data){
                    return ({
                        name:result.data.name,
                        username:result.data.username,
                        isVerified:result.data.isVerified,
                        uid:uid,
                        profile:result.data.profileUri
                    });
    
                }
            } catch (error) {}
            return null;
        }

        const fetchUserInfo = async () => {
            try {
                const usersInfo = await Promise.all(recentSearchUserID.map(async (id) => {
                    return await getUserInfo(id);
                }));
                const filteredUsersInfo = usersInfo.filter(userInfo => userInfo !== null);
                setInitialUsers(filteredUsersInfo);
            } catch (error) {}
        };
    
        if (recentSearchUserID.length > 0) {
            fetchUserInfo();
        }
    }, [recentSearchUserID]);

    
    useEffect(()=>{
        if(!searchText && initialUsers.length > 0){
            SetUserDataList(initialUsers);
        }
    },[initialUsers]);





    const dataLoadingAnimation = () => {
        return(
            <View style={styles.loadingContainer}>
                {isLoading && <ActivityIndicator size='large' color='#ffffff'/>}
                {fetchError && <Text style={{color:'#ffffff'}}>{fetchError}</Text>}
            </View>
        );
    }

    const handleUserProfileClick = (uid) => {
        if(uid == selfUID){
            navigation.navigate('Profile');
            return;
        }
        const index = recentSearchUserID.indexOf(uid);
        if (index !== -1) {
            // Remove the existing uid from the array
            const updatedArray = recentSearchUserID.filter(id => id !== uid);
            // Add the uid to the beginning of the array
            const newArray = [uid, ...updatedArray];
            // Update the state with the new array
            setRecentSearchUserID(newArray);
        } else {
            if(recentSearchUserID.length > 5){
                setRecentSearchUserID([uid, ...recentSearchUserID.slice(0, 5)]);
            } else {
                setRecentSearchUserID([uid, ...recentSearchUserID]);
            }
        }
        navigation.push('UserProfile', {key: getRandomUUID(), uid});
    }

    const renderUsers = ({item}) => {
        return(
            <TouchableOpacity style={styles.userContainer} onPress={()=>{handleUserProfileClick(item.uid)}}>
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

    const DisplayLoadedData = () => {
        return (
            <>
                <FlatList
                    data={userDataList}
                    renderItem={renderUsers}
                />
            </>
        );
    }

    return(
        <>
        <View style={[styles.mainContainer, {paddingBottom: bottomNavigationHeight}]}>
            <View style={styles.searchBx}>
                <View style={styles.searchInpBx}>
                <TextInput
                style={styles.searchInput}
                placeholder="Search"
                placeholderTextColor={placeHolderColor}
                onChangeText={setSearchText}
                onSubmitEditing={searchUsers}
                />
                <TouchableOpacity style={styles.searchBtn} onPress={searchUsers}>
                <Image
                source={require('./../../assets/search-icon.png')}
                style={styles.search_icon}
                />
                </TouchableOpacity>
                </View>
            </View>
            {isDataLoaded || dataLoadingAnimation()}
            {isDataLoaded && DisplayLoadedData()}
            <BottomNavigation componentHightSetter={setBottomNavigationHeight}/>
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
    loadingContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    searchBx:{
        paddingHorizontal:5,
        paddingVertical:15,
        position:'relative'
    },
    searchInpBx:{
        borderWidth:2,
        borderColor:'#aaa',
        borderRadius:30,
        flexDirection:'row',
        overflow:'hidden',
        height:50
    },
    searchInput:{
        fontSize:20,
        color:'#ffffff',
        flex:1,
        paddingHorizontal:15
    },
    searchBtn:{
        paddingHorizontal:15,
        justifyContent:'center'
    },
    search_icon:{
        tintColor:'#ffffff',
        width:28,
        height:28,
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