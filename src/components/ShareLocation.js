import { View, StyleSheet, StatusBar, Text, Alert, Linking, TouchableOpacity, Image, ActivityIndicator, FlatList, TextInput } from "react-native";
import * as ExpoLocation from 'expo-location';
import { useState, useEffect } from "react";
import axiosInstance from "../config/axiosConfig";


export default function ShareLocation({navigation}) {
    const [myLocation, setMyLocation] = useState(null);
    const [bitmojiData, setBitmojiData] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState('');
    const [searchText, setSearchText] = useState('');
    const [userDataList, SetUserDataList] = useState([]);


    //for loading user
    const [isUserDataLoaded, setIsUserDataLoaded] = useState(true);
    const [isUserLoading, setIsUserLoading] = useState(false);
    const [fetchUserError, setFetchUserError] = useState('');
    

    //values
    const [selectedBitmoji, setSelectedBitmoji] = useState(null);
    const [description, setDescription] = useState('');
    const [shareWith, setShareWith] = useState([]);

    //submit add error
    const [isSubmited, setIsSubmited] = useState(false);
    const [bitmojiError, setBitmojiError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [peopleError, setPeopleError] = useState('');




    


    // const getUserInfo = async(uid) => {
    //     setFetchUserError(''); 
    //     try {
    //         const result = await axiosInstance.get(`api/user/profile/${uid}`);
    //         if(result.status === 200 && result.data){
    //             return ({
    //                 name:result.data.name,
    //                 username:result.data.username,
    //                 isVerified:result.data.isVerified,
    //                 uid:uid,
    //                 profile:result.data.profileUri
    //             });
    //         }
    //     } catch (error) {
    //         if(error.response && error.response.data && error.response.data.message){
    //             setFetchUserError(error.response.data.message);
    //             if(error.response.status == 404){
    //                 return null;
    //             }
    //         } else {
    //             setFetchUserError(error.message);
    //         }
    //     }
    //     return false;
    // }

    // const keepshareWithMemory = async() => {
    //     const selfID = await selfUID();
    // }

    // const getshareWithMemory = async() => {
    //     try{
    //         const selfID = await selfUID();
    //         const list = await AsyncStorage.getItem(selfID + 'shareLocationWith');
    //         if(list !== null){
    //             const shareWithList = JSON.parse(uidList);
    //             setShareWith(shareWithList);
    //             return shareWithList;
    //         }
    //     } catch (error) {
    //         setShareWith([]);
    //     }
    //     return false;
    // }


    const getMyLocation = async() => {
        let {status} = await ExpoLocation.requestForegroundPermissionsAsync();
        if(status === "granted"){
            let isGPSEnabled = false
            try{
                isGPSEnabled = await ExpoLocation.hasServicesEnabledAsync();
                
                let location = await ExpoLocation.getCurrentPositionAsync({ accuracy: ExpoLocation.Accuracy.Balanced });
                setMyLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });
                
            } catch (error) {
                if(!isGPSEnabled){
                    alert('GPS (Location Services) is not enabled');
                }
                navigation.goBack();
            }
          
        } else {
            Alert.alert(
                'Permission Required',
                'Please grant permission to access your location.',
                [
                {
                    text: 'Cancel',
                    onPress: () => {
                    // Handle cancel action if needed
                    },
                    style: 'cancel',
                },
                {
                    text: 'Open Settings',
                    onPress: () => {
                    // Open app settings
                    Linking.openSettings();
                    },
                },
                ],
                { cancelable: false }
            );
            navigation.goBack();
        }
        
    }


    const getBitmojis = async() => {
        setFetchError('');
        setIsDataLoaded(false);
        setIsLoading(true);
        try {
            const response = await axiosInstance.get(`api/location/get/bitmojis`);
            if(response.data){
                setBitmojiData(response.data);
                setIsDataLoaded(true);
                setIsLoading(false);
                return true;
            }
        } catch (error) {
            if(error.response && error.response.data && error.response.data.message){
                setFetchError(error.response.data.message);
            } else {
                setFetchError(error.message);
            }
            setIsLoading(false);
            return false;
        }
    }

    const initialize = async() => {
        getMyLocation();
        let result = await getBitmojis();
    }

    useEffect(()=>{
        initialize();
    },[]);

    const dataLoadingAnimation = () => {
        return(
            <View style={styles.loadingContainer}>
                {isLoading && <ActivityIndicator size='large' color='#ffffff'/>}
                {fetchError && <Text style={{color:'#ffffff'}}>{fetchError}</Text>}
            </View>
        );
    }

    const userDataLoadingAnimation = () => {
        return(
            <View style={styles.loadingContainer}>
                {isUserLoading && <ActivityIndicator size='large' color='#ffffff'/>}
                {fetchUserError && <Text style={{color:'#ffffff'}}>{fetchUserError}</Text>}
            </View>
        );
    }

    
    const searchUsers = async(text) => {
        setFetchUserError('');
        if(!text){
            setIsUserDataLoaded(true);
            return;
        }
        
        setIsUserLoading(true);
        setIsUserDataLoaded(false);
        try {
            const response = await axiosInstance.get(`api/user/search/${text.toLowerCase()}`);
            if(response.data){
                if(response.data.length == 0){
                    setFetchUserError('No user Found');
                } else {
                    SetUserDataList(response.data);
                    setIsUserDataLoaded(true);
                }
            }
        } catch (error) {
            if(error.response && error.response.data && error.response.data.message){
                setFetchUserError(error.response.data.message);
            } else {
                setFetchUserError(error.message);
            }
        }
        setIsUserLoading(false);
    }

    const handleSearchChange = (text) => {
        setSearchText(text);
        searchUsers(text);
    }

    const renderBitmoji = () => {
        return(
            <FlatList
                horizontal={true}
                data={bitmojiData}
                gap={5}
                renderItem={({item})=>
                    (
                        <TouchableOpacity activeOpacity={0.7} style={{margin:5}} onPress={()=>{setSelectedBitmoji(item._id)}}>
                            <View style={styles.bitmojiBx}>
                                <Image
                                    source={{uri: item.photo}}
                                    style={{width:80, height: 80}}
                                />
                                <View style={{width:12, height:12, borderColor:'#ddd', borderWidth:1.5, borderRadius:6, backgroundColor:(selectedBitmoji == item._id? '#76E7EB' : null)}}></View>
                            </View>
                        </TouchableOpacity>
                    )
                }
                ListEmptyComponent={<Text style={{color:'#dddddd', textAlign:'center', padding:10}}>Bitmoji not Found</Text>}
            />
        );
    }

    const handleSubmit = async() => {
        setBitmojiError('');
        setDescriptionError('');
        setPeopleError('');

        if(!selectedBitmoji){
            setBitmojiError('Select one Bitmoji');
            return;
        }
        if(shareWith.length == 0){
            setPeopleError('Choose people to share');
            return;
        }
        setIsDataLoaded(false);
        setIsLoading(true);
        setFetchError('');
        try {
            const data = {
                latitude:myLocation.latitude,
                longitude:myLocation.longitude,
                description:description,
                shareWith:shareWith,
                bitmoji:selectedBitmoji
            }
            const response = await axiosInstance.post(`api/location/share`, data);
            if(response.status == 200){
                navigation.pop();
                navigation.replace('location');
            }
        } catch (error) {
            if(error.response && error.response.data && error.response.data.message){
                setFetchError(error.response.data.message);
            } else {
                setFetchError(error.message);
            }
            setIsLoading(false);
        }
    }



    const renderUsers = ({item}) => {
        const isActive = shareWith.includes(item.uid);
        return(
            <TouchableOpacity 
            activeOpacity={1} 
            style={[styles.userContainer,{backgroundColor: (isActive ? '#333': null)}]} 
            onPress={()=>{
                if(isActive){
                    const updatedArray = shareWith.filter(id => id !== item.uid);
                    setShareWith(updatedArray);
                } else {
                    setShareWith((prev)=> [...prev, item.uid])
                }
            }}
            >
                <View style={styles.profileCntainer}>
                    <Image
                        source={item.profile ? {uri: item.profile} : require('./../../assets/profile-default.png')}
                        style={styles.profileImage}
                    />
                    <View style={styles.detailsContainer}>
                        <Text style={{color:'#fff'}}>{item.username}{item.isVerified && <Image source={require('./../../assets/verified-icon.png')} style={{width:20, height:20}}/>}</Text>
                        <Text style={{color:'#fff'}}>{item.name}</Text>
                    </View>
                    <View style={{flex: 1, justifyContent:'center', alignItems:'flex-end'}}>  
                        <View style={styles.userCheckBx}>
                            {
                            isActive && 
                            <Image
                             source={require('./../../assets/check-box-icon.png')}
                             style={{width:'100%', height:'100%'}}
                            />
                            }
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }


    return(
        <View style={styles.mainContainer}>
            <View style={styles.topHeaderBx}>
                <TouchableOpacity style={{padding: 5}} onPress={()=>{navigation.goBack()}}>
                    <Image
                        source={require('./../../assets/left-back-icon.png')}
                        style={styles.backBtnIcon}
                    />
                </TouchableOpacity>
                <Text style={styles.HeadingTxt}>Share Location</Text>
            </View>
            {
                !isDataLoaded?
                dataLoadingAnimation()
                :
                <View style={{flex:1}}>
                    <View>
                        {renderBitmoji()}
                        {bitmojiError && <Text style={styles.errorMsg}>{bitmojiError}</Text>}
                    </View>
                    <TextInput 
                    style={styles.descriptionInput} 
                    placeholder="Description" 
                    placeholderTextColor={'#555'}
                    maxLength={60}
                    value={description}
                    onChangeText={(text)=>{setDescription(text)}}
                    />
                    <TextInput 
                    style={styles.searchInput} 
                    placeholder="Search User" 
                    placeholderTextColor={'#555'}
                    maxLength={60}
                    value={searchText}
                    onChangeText={handleSearchChange}
                    />
                    

                    <View style={{flex:1, paddingVertical: 10, paddingHorizontal:10}}>
                        {
                            !isUserDataLoaded?
                            userDataLoadingAnimation()
                            :
                            <FlatList
                                data={userDataList}
                                renderItem={renderUsers}
                            />
                        }
                        <View>
                        {peopleError && <Text style={styles.errorMsg}>{peopleError}</Text>}
                        </View>
                    </View>
                    <TouchableOpacity style={styles.sbmtbtn} onPress={()=>{handleSubmit()}}>
                        <Text style={styles.sharewithcount}>Share with {shareWith.length} people</Text>
                    </TouchableOpacity>
                </View>
            }
            

        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#000000',
        paddingTop:(StatusBar.currentHeight || 40),
        flex: 1
    },
    loadingContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    topHeaderBx: {
        paddingVertical:10,
        paddingHorizontal:10,
        flexDirection:'row',
        alignItems:'center',
        gap:20
    },
    backBtnIcon:{
        tintColor:'#ffffff',
        width:32,
        height:32
    },
    HeadingTxt: {
        fontSize:24,
        color:'#fff',
    },
    bitmojiBx:{
        padding:5, 
        borderColor:'#999', 
        borderWidth:1, 
        alignItems:'center', 
        gap:10, 
        borderRadius:10
    },
    descriptionInput: {
        marginTop:5,
        marginHorizontal:10,
        borderColor:'#777',
        borderRadius:7,
        borderWidth:2,
        paddingVertical:4,
        paddingHorizontal:10,
        color:'#ccc',
        fontSize:14
    },
    searchInput: {
        marginTop:8,
        marginHorizontal:10,
        borderColor:'#777',
        borderRadius:7,
        borderWidth:2,
        paddingVertical:4,
        paddingHorizontal:10,
        color:'#ccc',
        fontSize:16
    },
    sharewithcount: {
        color:'#fff',
        padding:5,
        textAlign:'center',
        // borderBottomWidth:1,
        // borderColor:'#777'

    },
    userContainer:{
        // backgroundColor:'#444',
        paddingHorizontal:10,
        paddingVertical:8,
        marginTop:5
    },
    profileCntainer:{
        flexDirection:'row'
    },
    detailsContainer:{
        paddingLeft:10,
        justifyContent:'center'
    },
    profileImage:{
        width:40,
        height:40,
        borderRadius:20
    },
    sbmtbtn: {
        backgroundColor: '#0484f5',
        marginBottom:10,
        marginHorizontal:30,
        borderRadius:10
    },
    errorMsg: {
        color:'#f00',
        paddingHorizontal:20
    },
    userCheckBx:{
        width:15, 
        height:15, 
        borderColor:'#777', 
        borderWidth:1, 
        borderRadius:7.5, 
        overflow:'hidden'
    }
});