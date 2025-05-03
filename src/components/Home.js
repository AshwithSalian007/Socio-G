import {View, StyleSheet, Text, SafeAreaView, TouchableOpacity, Image, FlatList, RefreshControl, Dimensions, StatusBar} from 'react-native'
import { useState, useEffect, useRef, useCallback } from 'react'
import axiosInstance from '../config/axiosConfig';
import BottomNavigation from './BottomNavigation';
import PostComponent from './PostComponent';



export default function Home({navigation}){
    const [isRefresh, setIsRefresh] = useState(false);
    const [fetchError, setFetchError] = useState(false);
    const [bottomNavigationHeight, setBottomNavigationHeight] = useState(0);

    const [notificationCount, setNotificationCount] = useState(0);
    //for video posts
    const [VisibleItem, setVisibleItem] = useState('');
    const [isMuted, setIsMuted] = useState(true);


    const [postData, setPostData] = useState([]);
    
    const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

    let unlikedImg = require('../../assets/unlike-icon.png');
    let likedImg = require('../../assets/liked-icon.png');
    let commentImg = require('../../assets/comment-icon.png');
    let sendImg = require('../../assets/send-icon.png');

    // useEffect(() => {
    //     const updateScreenWidth = () => {
    //       setScreenWidth(Dimensions.get('window').width);
    //     };
        
    
    //     Dimensions.addEventListener('change', updateScreenWidth);
    
    //     // Clean up event listener on component unmount
    //     return () => {
    //       Dimensions.removeEventListener('change', updateScreenWidth);
    //     };
    //   }, []);




    

    const fetchData = async() =>{
        fetchNotificationCount();
        setIsRefresh(true);
        try{
            const response = await axiosInstance.get('api/post/serve');
            
            
            if(response.status == 200){
                let postArray = response.data;
                setPostData(postArray);
                setFetchError(false);
            } else {
                setFetchError(true);
            }
        } catch(e){
            setFetchError(true);
        }
        
        // console.log(screenWidth)
        // setTimeout(()=>{setIsRefresh(false)}, 3000)
        setIsRefresh(false);
    }

    useEffect(() => {fetchData()}, []);

    const fetchNotificationCount = async() => {
        try {
            const response = await axiosInstance.get('/api/notification/count');
            if(response.status == 200 && response.data && response.data.count){
                setNotificationCount(response.data.count);
            }
        } catch (error){
            
        }
    }

    useEffect(() => {
        // Set up the interval
        const intervalId = setInterval(fetchNotificationCount, 10000);

        // Cleanup function to clear the interval
        return () => clearInterval(intervalId);
    }, []);



    const renderFeedFooter = () => {
        return (
            <>
            {fetchError && (<View style={styles.errorContainer}>
                <Text style={styles.fetchErrorTxt}>! Something went wrong.</Text>
                <Image
                source={require('../../assets/crying.png')}
                style={{width:80, height:80}}
                />
                </View>)}
            </>
        )
    }

    const renderFeed = ({item}) => {
        return (
            <PostComponent item={item} navigation={navigation} postData={postData} setPostData={setPostData} screenWidth={screenWidth} VisibleItemId={VisibleItem} isMuted={isMuted} setIsMuted={setIsMuted} menuText="Report" menuCallback={(item)=>{navigation.navigate('report', {type:'post', id: item._id});}}/>
        )
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

    return(
        <View style={[styles.mainContainer, {paddingBottom: bottomNavigationHeight}]}>
        <View style={styles.topNavBox}>
            <Text style={styles.appTitleTxt}>Socio-G</Text>
            <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', gap:16}}>
            <TouchableOpacity 
            style={styles.notifyBtnTouch} 
            onPress={() => {
                setNotificationCount(0);
                navigation.navigate('notification');
            }}>
                <Image
                    style={{tintColor:'#fff', width:28, height:28}}
                    source={require('../../assets/notification-icon.png')}
                />
                {
                    notificationCount > 0 && 
                    <View style={styles.notifyCountBx}><Text style={styles.notifyCountTxt}>{notificationCount < 100 ? notificationCount : '99+'}</Text></View>
                }
            </TouchableOpacity>

            <TouchableOpacity style={styles.notifyBtnTouch} onPress={() => navigation.navigate('aiChatHome')}>
                <Image
                style={styles.aiChatIcon}
                source={require('../../assets/ai-chat-icon.png')}
                />
                
            </TouchableOpacity>
            </View>
        </View>
        <View style={styles.feedBox}>
            <FlatList
                data={postData}
                renderItem={renderFeed}
                onViewableItemsChanged={_onViewableItemsChanged}
                viewabilityConfig={_viewabilityConfig}
                refreshControl={
                    <RefreshControl
                    refreshing={isRefresh}
                    onRefresh={fetchData}
                    
                    />
                }
                ListFooterComponent={renderFeedFooter}
            />
        </View>
        <BottomNavigation componentHightSetter={setBottomNavigationHeight}/>
        </View>
    );
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
    aiChatIcon: {
        width:30,
        height:30
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
        paddingBottom:5
    },
    feedUserName:{
        color:'#fff',
        fontSize:16,
        marginLeft:8,
        includeFontPadding:false
    },
    feedBottomBx:{
        paddingVertical:8,
        marginHorizontal:14
    },
    like_cmt_shr_icn_container:{
        flexDirection:'row',
        gap:25
        
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
    captionTxt:{
        marginTop:10,
        color:'#fff'
    },
    postedDate:{
        color:'#777',
        fontSize:13
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