import { Image, Text, TouchableOpacity, View, StyleSheet, StatusBar } from 'react-native';
import axiosInstance from '../config/axiosConfig';
import { useEffect, useState } from 'react';
import { navigate } from '../utils/NavigationUtils';
import { Video } from 'expo-av';
import { getRandomUUID, timeAgo } from '../utils/Functions';

export default function PostComponent({item, navigation, postData, setPostData, screenWidth, VisibleItemId, isMuted, setIsMuted, menuText = null, menuCallback = () => {}}){
    let unlikedImg = require('../../assets/unlike-icon.png');
    let likedImg = require('../../assets/liked-icon.png');
    let commentImg = require('../../assets/comment-icon.png');
    const [menuActive, setmenuActive] = useState(false);
    const [isLiked, setIsLiked] = useState(item.liked);
    const [likeCount, setlikeCount] = useState(item.likeCount);
    const [pause, setPause] = useState(false);
    const [videoMute, setVideoMute] = useState(true);
    const [videoPlay, setVideoPlay] = useState(false);

    useEffect(() => {
        setVideoMute(() => (isMuted || VisibleItemId != item._id));
    }, [VisibleItemId, isMuted]);

    useEffect(() => {
        setVideoPlay(() => (!pause && VisibleItemId == item._id));
    }, [VisibleItemId, pause]);

    return(
        <View style={styles.feedCard}>
            <View style={styles.feedTopBx}>
                <TouchableOpacity 
                activeOpacity={1}
                style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}
                onPress={()=>{navigation?.push('UserProfile', {key:getRandomUUID(), uid: item.author})}}
                >
                    <Image
                        source={{uri:item.profile}}
                        style={{width:32, height:32, borderRadius:20}}
                    />
                    <Text style={styles.feedUserName}>
                        {item.name}
                        {item.isVerified
                        &&
                        <Image
                        source={require('../../assets/verified-icon.png')}
                        style={{width:20, height:20}}
                        />
                        }
                    </Text>
                </TouchableOpacity>
            <View style={{flex:1, alignItems: 'flex-end', position:'relative', zIndex:99}}>
                {
                    menuText 
                    &&
                    <TouchableOpacity
                        style={{paddingHorizontal:12, paddingVertical:8}}
                        onPress={()=>{
                            setmenuActive(!menuActive);
                        }}
                    >
                    <Image
                    source={require('./../../assets/dot-menu-icon.png')}
                    style={{tintColor:'#ffffff', width:18, height:18}}
                    />
                    </TouchableOpacity>
                }
                
            </View>
                {
                    menuActive &&
                    <View style={{backgroundColor:'#000000', position:'absolute', top:'100%', right:0, zIndex:99, borderTopWidth:1, borderColor: '#1a1a1a', borderBottomWidth: 1}}>
                        <TouchableOpacity 
                        onPress={()=> {
                            setmenuActive(false);
                            menuCallback(item);
                        }}
                        >
                        <Text 
                        style={
                            {
                                color:'#ffffff',
                                paddingVertical:8,
                                paddingHorizontal:25,
                                fontSize:16
                            }
                        }>
                            {menuText}
                        </Text>
                        </TouchableOpacity>
                    </View>
                 }
            </View>
            {
                item.category == "video" ? 
                (
                    <TouchableOpacity activeOpacity={1} onPress={()=>{setPause((prev) => !prev)}}>
                    <Video
                    source={{uri: item.content}}
                    style={{width:screenWidth, height:screenWidth, backgroundColor:'#000'}}
                    resizeMode='contain'
                    useNativeControls={false}
                    shouldPlay={videoPlay}
                    isLooping={true}
                    isMuted={videoMute}
                    />
                    {
                    pause && <Image 
                    source={require('./../../assets/pause.png')}
                    style={{ width:60, height:60, position:'absolute', top:'50%', left:'50%', transform:[{translateX:-30}, {translateY:-30}]}}
                    />
                    }
                    <TouchableOpacity activeOpacity={0.8} style={{position:'absolute', bottom:5, right: 10, padding: 10}} onPress={()=>{setIsMuted((prev)=> !prev)}}><Image source={isMuted ? require('./../../assets/mute.png') : require('./../../assets/sound.png')} style={{width:23, height:23}}/></TouchableOpacity>
                    </TouchableOpacity>
                )
                :
                <Image 
                source={{uri:item.content}}
                style={{width:screenWidth, height:(item.height / (item.width / screenWidth)), resizeMode:'contain'}}
                />
            }
            <View style={styles.feedBottomBx}>
                <View style={styles.like_cmt_shr_icn_container}>
                <TouchableOpacity 
                style={styles.like_cmt_shr_btn}
                activeOpacity={0.6} 
                onPress={async()=>{
                    if(!isLiked){
                    try {
                        // const modified = postData.map((post)=> {
                        //     if(post._id == item._id){
                        //         let newData = post;
                        //         newData.liked = true;
                        //         newData.likeCount += 1;
                        //         return newData;
                        //     } else {
                        //         return post;
                        //     }
                        // })
                        // setPostData(modified);
                        setIsLiked(true);
                        setlikeCount(prev=> prev + 1);
                        const response = await axiosInstance.get(`api/post/like/${item._id}`)
                    } catch (error) {
                        // console.log(error);
                        // const modified = postData.map((post)=> {
                        //     if(post._id == item._id){
                        //         let newData = post;
                        //         newData.liked = false;
                        //         newData.likeCount -= 1;
                        //         return newData;
                        //     } else {
                        //         return post;
                        //     }
                        // })
                        // setPostData(modified);
                        setIsLiked(false);
                        setlikeCount(prev=> prev - 1);
                    }
                } else {
                    try {
                        // const modified = postData.map((post)=> {
                        //     if(post._id == item._id){
                        //         let newData = post;
                        //         newData.liked = false;
                        //         newData.likeCount -= 1;
                        //         return newData;
                        //     } else {
                        //         return post;
                        //     }
                        // })
                        // setPostData(modified);
                        setIsLiked(false);
                        setlikeCount(prev=> prev - 1);
                        const response = await axiosInstance.get(`api/post/dislike/${item._id}`)
                    } catch (error) {
                        // console.log(error);
                        // const modified = postData.map((post)=> {
                        //     if(post._id == item._id){
                        //         let newData = post;
                        //         newData.liked = true;
                        //         newData.likeCount += 1;
                        //         return newData;
                        //     } else {
                        //         return post;
                        //     }
                        // })
                        // setPostData(modified);
                        setIsLiked(true);
                        setlikeCount(prev=> prev + 1);
                    }
                }
                }}>
                    <Image 
                    source={isLiked? likedImg : unlikedImg}
                    style={[isLiked? {} : styles.bottomIconClr, styles.bottomIconSize]}
                    />
                </TouchableOpacity>
                <TouchableOpacity 
                style={styles.like_cmt_shr_btn}
                onPress={()=>{
                    navigate('comment', {pid: item._id});
                }}>
                    <Image 
                    source={commentImg}
                    style={[styles.bottomIconClr, styles.bottomIconSize]}
                    />
                </TouchableOpacity>

                {/* <Image 
                source={sendImg}
                style={[styles.bottomIconClr, styles.bottomIconSize]}
                /> */}
                </View>
                <Text style={styles.likesTxt}>{likeCount} like{(likeCount > 1 ? 's' : '')}</Text>
                <Text style={[styles.captionTxt, item.caption == ""? {display:'none'}: {display:'flex'}]}><Text style={styles.unameCaption}>{item.name}</Text> {item.caption}</Text>
                <Text style={styles.postedDate}>{timeAgo(item.createdAt)}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer:{
        backgroundColor:'#000',
        paddingTop: StatusBar.currentHeight || 40,
        flex:1,
    },
    topNavBox:{
        // backgroundColor:'#f00',
        paddingLeft:18,
        paddingRight:24,
        paddingVertical:10,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    appTitleTxt:{
        fontSize:26,
        color:'#fff',
        fontWeight:'bold'
    },
    notifyBtnTouch:{
        position:'relative',
        padding:2
    },
    notify_icon:{
        tintColor:'#fff',
        width:26,
        height:26
    },
    notifyCountBx:{
        position:'absolute',
        top:0,
        right:0,
        backgroundColor:'#f00',
        minWidth:16,
        height:16,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        overflow:'hidden',
        // display:'none'
    },
    notifyCountTxt:{
        color:'#fff',
        fontSize:10,
        includeFontPadding:false,
        verticalAlign:'middle'
    },
    feedBox:{
        backgroundColor:'#000',
        flex:1
    },
    feedCard:{
        paddingVertical:20
    },
    feedTopBx:{
        flexDirection:'row',
        alignItems:'center',
        paddingLeft:10,
        paddingBottom:5,
    },
    feedUserName:{
        color:'#fff',
        fontSize:16,
        marginLeft:8,
        includeFontPadding:false
    },
    feedBottomBx:{
        paddingVertical:8,
        marginHorizontal:6
    },
    like_cmt_shr_icn_container:{
        flexDirection:'row',
        gap:14
    },
    like_cmt_shr_btn:{
        paddingVertical:4,
        paddingHorizontal:8
    },
    bottomIconClr:{
        tintColor:'#fff'
    },
    bottomIconSize:{
        width:24,
        height:24
    },
    unameCaption:{
        fontWeight:'bold'
    },
    likesTxt: {
        color:'#fff',
        marginTop:2,
        marginLeft:8
    },
    captionTxt:{
        color:'#fff',
        marginLeft:8
    },
    postedDate:{
        color:'#777',
        fontSize:13,
        marginLeft:8
    },
    fetchErrorTxt:{
        color:'#ff5555',
        paddingVertical:20,
        fontSize:20
    },
    errorContainer:{
        alignItems:'center',
        paddingBottom:20
    }
});