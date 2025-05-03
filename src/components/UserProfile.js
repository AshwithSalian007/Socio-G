import AsyncStorage from '@react-native-async-storage/async-storage';
import {Text, StyleSheet, View, Image, TouchableOpacity, SafeAreaView, Platform, StatusBar, ActivityIndicator, Alert, Dimensions, FlatList, RefreshControl} from 'react-native'
import { reset } from '../utils/NavigationUtils';
import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '../config/axiosConfig';
import CustomAlert from './CustomAlert';
import { getRandomUUID, selfUID } from '../utils/Functions';
import PostComponent from './PostComponent';


export default function UserProfile({navigation, route}){
    

    if(!(route.params && route.params.uid)){
        return(
            <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#000'}}>
                <Text style={{color:'#ff0000'}}>User not found</Text>
                <TouchableOpacity 
                style={{paddingVertical:10, paddingHorizontal:20, backgroundColor:"#00f", margin:10, borderRadius:20}}
                onPress={()=>{navigation.goBack()}}
                >
                    <Text style={{color:'#ffffff'}}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const {uid} = route.params;

    const [menuActive, setmenuActive] = useState(false);


    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    

    const [username, setUsername] = useState(null);
    const [name, setName] = useState(null);
    const [isVerified, setIsVerified] = useState(false);
    const [profession, setProfession] = useState(null);
    const [bio, setBio] = useState(null);
    const [profileImgUri, setProfileImgUri] = useState('');
    const [postCount, setPostCount] = useState('0');
    const [followerCount, setFollowerCount] = useState('0');
    const [followingCount, setFollowingCount] = useState('0');
    const [isFollowing, setIsFollowing] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);
    const [isFollowRequested, setIsFollowRequested] = useState(false);


    const [followBtnClicked, setFollowBtnClicked] = useState(false);
    const [customAlertVisible, setCustomAlertVisible] = useState(false);

    //post
    const [postData, setPostData] = useState([]);
    const [isPostDataLoaded, setIsPostDataLoaded] = useState(false);
    const [postFetchError, setPostFetchError] = useState(null);

    //for video posts
    const [VisibleItem, setVisibleItem] = useState('');
    const [isMuted, setIsMuted] = useState(true);
    const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
    //post end
    



    const getData = async() => {
        setIsLoading(true);
        try {
            const result = await axiosInstance.get(`api/user/profile/${uid}`);
            if(result.status === 200 && result.data){
                setIsLoading(false);
                setUsername(result.data.username);
                setName(result.data.name);
                setIsVerified(result.data.isVerified);
                setProfession(result.data.profession);
                setBio(result.data.bio);
                setProfileImgUri(result.data.profileUri);
                setPostCount(result.data.postCount);
                setFollowerCount(result.data.followerCount);
                setFollowingCount(result.data.followingCount);
                setIsFollowing(result.data.isFollowing);
                setIsPrivate(result.data.isPrivate);
                setIsFollowRequested(result.data.isFollowRequested);

            } else {
                setIsLoading(false);
                setFetchError('Something went Wrong');
                setFetchError('Oops! Something went Wrong');
            }
        } catch (error) {
            setIsLoading(false);
            if(error.response && error.response.data && error.response.data.message){
                setFetchError(error.response.data.message);
            } else {
                setFetchError(error.message);
            }
        }
    }

    const fetchData = async() =>{
        setIsPostDataLoaded(false);
        setPostFetchError(null);
        try{
            const response = await axiosInstance.get('api/post/serve/' + uid);
            if(response.status == 200){
                let postArray = response.data;
                setPostData(postArray);
                setIsPostDataLoaded(true);
            } else {
                setPostFetchError('Not able to fetch posts');
            }
        } catch(error){
            if(error.response && error.response.data && error.response.data.message){
                setPostFetchError(error.response.data.message);
            } else {
                setPostFetchError(error.message);
            }
        }
    }

    const checkUserIsSelf = async() => {
        const selfID = await selfUID();
        if(selfID == uid){
            navigation.replace('Profile');
        }
    }

    const init = async() => {
        await checkUserIsSelf();
        getData();
        fetchData();
    }
        

    useEffect(()=>{
        init();
    }, []);

    const _onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
        if(viewableItems.length > 0){
            setVisibleItem(viewableItems[0].item._id);
        } else {
            setVisibleItem('');
        }
    }, []);

    const _viewabilityConfig = {
        itemVisiblePercentThreshold: 65
    }



    const unfollowUser = async() => {
        try {
            const response = await axiosInstance.post('api/user/unfollow', {targetUserId:uid});
            if(response.status == 200){
                setFollowerCount((count)=>count-1);
                setIsFollowing(false);
            }
        } catch (error){
            if(error.response && error.response.data && error.response.data.message){
                alert(error.response.data.message);
            } else {
                alert(error.message);
            }
        }
        setFollowBtnClicked(false);
    }

    const followUser = async() => {
        try {
            const response = await axiosInstance.post('api/user/follow', {targetUserId:uid});
            if(response.status == 200){
                if(isPrivate){
                    setIsFollowRequested(true);
                } else {
                    setFollowerCount((count)=>count+1);
                    setIsFollowing(true);
                }
            }
        } catch (error){
            if(error.response && error.response.data && error.response.data.message){
                alert(error.response.data.message);
            } else {
                alert(error.message);
            }
        }
        setFollowBtnClicked(false);
    }

    const removeFollowRequest = async() => {
        try {
            const response = await axiosInstance.post('api/user/follow/request/remove', {targetUserId:uid});
            if(response.status == 200){
                setIsFollowRequested(false);
            }
        } catch (error){
            if(error.response && error.response.data && error.response.data.message){
                getData();
                alert(error.response.data.message);
            } else {
                alert(error.message);
            }
        }
        setFollowBtnClicked(false);
    }




    if(!username){
        return(
            <>
                <View style={styles.mainContainer}>
                    <View style={styles.loadingContainer}>
                        {isLoading && <ActivityIndicator size='large' color='#ffffff'/>}
                        {fetchError && <Text style={{color:'#ffffff'}}>{fetchError}</Text>}
                    </View>
                </View>
            </>
        );
    }


    const handleFollowBtnPress = async() => {
        if(followBtnClicked){
            return;
        }
        setFollowBtnClicked(true);

        if(isFollowing && !isPrivate){
            unfollowUser();
        } else if(isFollowing && isPrivate){
            setCustomAlertVisible(true);
        } else if(isPrivate && isFollowRequested){
            removeFollowRequest();
        } else if(!isFollowing && !isFollowRequested){
            followUser();
        } else {
            setFollowBtnClicked(false);
        }
    }



    const renderHeaderComponent = () => {
        return (
            <View style={styles.profileBox}>
                <View style={styles.profileSubBx1}>
                    <View>
                        <Image
                        source={profileImgUri ? {uri: profileImgUri} : require('../../assets/profile-default.png')}
                        style={styles.profileImg}
                        />
                    </View>
                    <View style={styles.profileCountBoxSB}>
                        <View style={styles.countsBox}>
                            <Text style={styles.countsText}>{postCount}</Text>
                            <Text style={styles.countsDescription}>Posts</Text>
                        </View>
                        <TouchableOpacity style={styles.countsBox} onPress={()=>{navigation.push('FollowerList', {key: getRandomUUID(), username, uid})}}>
                            <Text style={styles.countsText}>{followerCount}</Text>
                            <Text style={styles.countsDescription}>Followers</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.countsBox} onPress={()=>{navigation.push('FollowingList', {key: getRandomUUID(), username, uid})}}>
                            <Text style={styles.countsText}>{followingCount}</Text>
                            <Text style={styles.countsDescription}>Following</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.profileSubBx2}>
                    <View style={styles.profileNameBox}>
                        <Text style={styles.profileNameTxt}>{name}</Text>
                        {isVerified &&
                        <Image
                        style={styles.verifiedIcon}
                        source={require('../../assets/verified-icon.png')}
                        />
                        }
                    </View>
                    <Text style={styles.professionTxt}>{profession}</Text>
                    <Text style={styles.bioTxt}>{bio}</Text>
                </View>
                <View style={{flexDirection:'row', alignItems:'center', gap:8}}>
                    <TouchableOpacity style={[styles.followBtn, {backgroundColor: (isFollowing || isFollowRequested)? '#555' : '#1f7eff'}]} onPress={handleFollowBtnPress}>
                        {
                            followBtnClicked ? 
                            <ActivityIndicator size='small' color='#ffffff'/> 
                            :
                            <Text style={styles.followTxt}>{isFollowing? 'Following' : (isFollowRequested ? 'Requested' : 'Follow')}</Text>
                        }
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.chatBtn}>
                        <Image
                        source={require('./../../assets/chat-icon.png')}
                        style={styles.chatBtnImg}
                        />
                    </TouchableOpacity> */}
                </View>
            </View>
        );
    }

    const renderPostsEmpty = () => {
        if(isPostDataLoaded){
            return (
                <View style={{minHeight:250, justifyContent:'center', alignItems:'center'}}>
                    <Text style={{color:'#aaaaaa', fontSize:32, fontWeight:'500'}}>0 Posts</Text>
                </View>
            )
        } else if(postFetchError) {
            return (
                <View style={{minHeight:250, justifyContent:'center', alignItems:'center'}}>
                    <Text style={{color:'#aaaaaa', fontSize:16}}>{postFetchError}</Text>
                </View>
            )
        } else {
            return (
                <View style={{minHeight:250, justifyContent:'center', alignItems:'center'}}>
                    <ActivityIndicator size='large' color='#ffffff'/>
                </View>
            )
        }
    }



    return(
        <>
        <View style={styles.mainContainer}>
        <CustomAlert visible={customAlertVisible} message={`If you want to follow again, you'll have to request to follow ${username} again.`} onCancel={()=>{setCustomAlertVisible(false); setFollowBtnClicked(false)}} onSuccess={()=>{setCustomAlertVisible(false); unfollowUser()}} successText='Unfollow'/>
            <View style={styles.topBox}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                <TouchableOpacity onPress={()=>{navigation.goBack()}}>
                    <Image
                    source={require('./../../assets/left-back-icon.png')}
                    style={styles.backBtnIcon}
                    />
                </TouchableOpacity>
                <Text style={styles.username}>{username}</Text>
                </View>
                <View style={{position:'relative', zIndex:99}}>
                    <TouchableOpacity
                    onPress={()=>{
                        setmenuActive((prev) => !prev);
                    }}
                    >
                    <Image
                    style={styles.menu_icon}
                    source={require('../../assets/dot-menu-icon.png')}
                    />
                    </TouchableOpacity>

                    {
                        menuActive &&

                    <View 
                    style={{position:'absolute', borderRadius:4, top:-5, right:'120%', width:130, backgroundColor:'#444', padding:2}}
                    >
                        <TouchableOpacity
                        style={{paddingVertical:5, alignItems:'center'}}
                        onPress={()=>{
                            setmenuActive(false);
                            navigation.navigate('report', {type:'user', id:uid});
                        }}
                        >
                            <Text style={{color:'#ffffff', fontSize:16, fontWeight:'500'}}>Report</Text>
                        </TouchableOpacity>
                    </View>
                    }

                </View>
            </View>
            

            <View>
                <FlatList
                    data={postData}
                    ListHeaderComponent={renderHeaderComponent}
                    renderItem={({item}) => {
                        return (
                            <PostComponent item={item} postData={postData} setPostData={setPostData} screenWidth={screenWidth} VisibleItemId={VisibleItem} isMuted={isMuted} setIsMuted={setIsMuted} menuText="Report" menuCallback={(item)=>{navigation.navigate('report', {type:'post', id: item._id});}}/>
                        )
                    }}
                    ListEmptyComponent={renderPostsEmpty}
                    refreshControl={
                        <RefreshControl
                        refreshing={isLoading}
                        onRefresh={init}
                        
                        />
                    }
                    onViewableItemsChanged={_onViewableItemsChanged}
                    viewabilityConfig={_viewabilityConfig}
                    ListFooterComponent={() => (<View style={{height:50}}></View>)}
                />
            </View>
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    mainContainer:{
        flex: 1,
        backgroundColor:'#000',
        paddingTop:(StatusBar.currentHeight || 40),
    },
    loadingContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    topBox:{
        // backgroundColor:'#0f0',
        flexDirection:'row',
        justifyContent:'space-between',
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
    menu_icon:{
        width:26,
        height:26,
        tintColor:'#fff'
    },
    profileBox:{
        backgroundColor:'#333',
        padding:15,
        marginHorizontal:8,
        borderRadius:18
    },
    profileImg:{
        width:60,
        height:60,
        borderRadius:30
    },
    profileSubBx1:{
        flexDirection:'row',
        alignItems:'center',
    },
    profileCountBoxSB:{
        // backgroundColor:'#fd4',
        flex:1,
        marginLeft:12,
        flexDirection:'row',
        gap:10,
        paddingVertical:3
    },
    countsBox:{
        backgroundColor:'#555',
        flex:1,
        alignItems:'center',
        padding:5,
        borderRadius:10,
        justifyContent:'center'
    },
    countsText:{
        fontSize:18,
        color:'#fff',
        fontWeight:'700'
    },
    countsDescription:{
        fontSize:12,
        color:'#fff'
    },
    profileSubBx2:{
        // backgroundColor:'#0f0',
        paddingVertical:10
    },
    profileNameBox:{
        // backgroundColor:'#f0f',
        flexDirection:'row',
        alignItems:'center'
    },
    profileNameTxt:{
        color:'#fff',
        fontWeight:'500',
        fontSize:19,
    },
    verifiedIcon:{
        width:24,
        height:24,
        marginLeft:2
    },
    professionTxt:{
        color:'#888',
        fontSize:12,
        // marginTop:-5
    },
    bioTxt:{
        color:'#ccc',
        marginTop:6
    },
    followBtn:{
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:10,
        borderRadius:15,
        flex:1
    },
    followTxt:{
        color:'#fff'
    },
    chatBtn:{
        backgroundColor:'#555',
        padding:9,
        height:38,
        width:38,
        borderRadius:10
    },
    chatBtnImg:{
        height:20,
        width:20,
        tintColor:'#ddd'
    }
});