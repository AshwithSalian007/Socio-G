import {Text, StyleSheet, View, Image, TouchableOpacity, SafeAreaView, Platform, StatusBar, ActivityIndicator, ScrollView, FlatList, Dimensions, RefreshControl, Alert} from 'react-native'

import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '../config/axiosConfig';
import BottomNavigation from './BottomNavigation';
import { getRandomUUID, selfUID } from '../utils/Functions';
import PostComponent from './PostComponent';


export default function Profile({navigation}){
    const [bottomNavigationHeight, setBottomNavigationHeight] = useState(0);

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

    //post
    const [postData, setPostData] = useState([]);
    const [isPostDataLoaded, setIsPostDataLoaded] = useState(false);
    const [postFetchError, setPostFetchError] = useState(null);

    //for video posts
    const [VisibleItem, setVisibleItem] = useState('');
    const [isMuted, setIsMuted] = useState(true);
    const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);


    const getData = async() => {
        // setToken(await AsyncStorage.getItem('token'));
        setIsLoading(true);
        try {
            const result = await axiosInstance.get('api/user/profile/');
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
            const selfid = await selfUID();
            const response = await axiosInstance.get('api/post/serve/' + selfid);
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
        

    const initialFetch = () => {
        getData();
        fetchData();
    }
    useEffect(()=>{
        initialFetch();
    }, []);

    const deletePost = async(postId) => {
        try {
            const response = axiosInstance.post('api/post/delete', {postId});
            initialFetch();
        } catch (error) {
            if(error.response && error.response.data && error.response.data.message){
                alert(error.response.data.message);
            } else {
                alert(error.message);
            }
        }
    }
    const deletePostHandler = (item) => {
        if(item._id){
            Alert.alert(
                'Post Delete',
                'Are you sure you want to delete this post?',
                [
                {
                    text: 'Cancel',
                    onPress: () => {
                    // Handle cancel action if needed
                    },
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: () => {
                        deletePost(item._id);
                    },
                },
                ],
                { cancelable: false }
            );
        }
    }

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


    if(!username){
        return(
            <>
                <View style={[styles.mainContainer, {paddingBottom: bottomNavigationHeight}]}>
                    <View style={styles.loadingContainer}>
                        {isLoading && <ActivityIndicator size='large' color='#ffffff'/>}
                        {fetchError && <Text style={{color:'#ffffff'}}>{fetchError}</Text>}
                    </View>
                    <BottomNavigation componentHightSetter={setBottomNavigationHeight}/>
                </View>
            </>
        );
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
                            <TouchableOpacity style={styles.countsBox} onPress={()=>{navigation.push('FollowerList', {key: getRandomUUID(), username})}}>
                                <Text style={styles.countsText}>{followerCount}</Text>
                                <Text style={styles.countsDescription}>Followers</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.countsBox} onPress={()=>{navigation.push('FollowingList', {key: getRandomUUID(), username})}}>
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
                    <View>
                        <TouchableOpacity style={styles.editProfileBtn} onPress={()=>{navigation.navigate('EditProfile')}}>
                            <Text style={styles.editProfileTxt}>Edit profile</Text>
                        </TouchableOpacity>
                    </View>
                </View>
        );
    }

    const renderPostsEmpty = () => {
        if(isPostDataLoaded){
            return (
                <View style={{minHeight:250, justifyContent:'center', alignItems:'center'}}>
                    <Text style={{color:'#aaaaaa', fontSize:32, fontWeight:'500'}}>No Posts Yet</Text>
                    <TouchableOpacity 
                    style={{backgroundColor:'#555', paddingVertical:7, paddingHorizontal:16, borderRadius:30, marginTop: 15}}
                    onPress={()=>{navigation.navigate('addPost')}}
                    >
                        <Text style={{color:'#efefef', fontSize:18, fontWeight:'600'}}>New Post</Text>
                    </TouchableOpacity>
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
        <View style={[styles.mainContainer, {paddingBottom: bottomNavigationHeight}]}>
            <View style={styles.topBox}>
                <Text style={styles.username}>{username}</Text>
                <View>
                    <TouchableOpacity onPress={async()=>{ navigation.navigate('menu')}}>
                    <Image
                    style={styles.menu_icon}
                    source={require('../../assets/menu-icon.png')}
                    />
                    </TouchableOpacity>
                </View>
            </View>
            
                
                <View>
                <FlatList
                    data={postData}
                    ListHeaderComponent={renderHeaderComponent}
                    renderItem={({item}) => {
                        return (
                            <PostComponent item={item} postData={postData} setPostData={setPostData} screenWidth={screenWidth} VisibleItemId={VisibleItem} isMuted={isMuted} setIsMuted={setIsMuted} menuText="delete" menuCallback={deletePostHandler}/>
                        )
                    }}
                    ListEmptyComponent={renderPostsEmpty}
                    refreshControl={
                        <RefreshControl
                        refreshing={isLoading}
                        onRefresh={initialFetch}
                        
                        />
                    }
                    onViewableItemsChanged={_onViewableItemsChanged}
                    viewabilityConfig={_viewabilityConfig}
                    ListFooterComponent={() => (<View style={{height:50}}></View>)}
                />
                </View>
            <BottomNavigation componentHightSetter={setBottomNavigationHeight}/>
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
    username:{
        fontSize:22,
        fontWeight:'500',
        textTransform:'lowercase',
        color:'#fff'
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
    editProfileBtn:{
        backgroundColor:'#555',
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:10,
        borderRadius:15
    },
    editProfileTxt:{
        color:'#fff'
    }
});