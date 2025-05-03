import { useEffect, useState } from "react";
import { FlatList, Image, StatusBar, StyleSheet, Text, View } from "react-native";
import axiosInstance from "../config/axiosConfig";
import { RefreshControl } from "react-native-gesture-handler";
import { BASE_URL } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function NotificationPage(){
    const [data, setData] = useState([]);
    const [isRefresh, setIsRefresh] = useState(false);
    const [fetchErrorMsg, setFetchErrorMsg] = useState('');
    const [token, setToken] = useState('');

    useEffect(()=>{
        (async()=>{
            const t = await AsyncStorage.getItem('token');
            setToken(t);
        })();
    }, []);


    const fetchData = async() => {
        setIsRefresh(true);
        setFetchErrorMsg('');
        try {
            const response = await axiosInstance.get('/api/notification/get/all');
            if(response.status==200){
                setData(response.data);
            }
        } catch (error) {
            if(error.response && error.response.data && error.response.data.message){
                setFetchErrorMsg(error.response.data.message);
            } else {
                setFetchErrorMsg(error.message);
            }
        }

        setIsRefresh(false);
    }


    useEffect(()=>{
        fetchData();
    },[])


    const renderNotification = ({item}) => {
        
        return (
            <View style={{flexDirection:'row', gap:10,alignItems:'center', padding: 10, borderBottomColor:'#33333388', borderBottomWidth:1, position:'relative'}}>
                <View>
                    <Image
                    source={{uri: `${BASE_URL}/api/user/profile/image/${token}/${item.sender.profileImageUrl}`}}
                    style={{width:50, height:50, borderRadius:25}}
                    />
                </View>
                <View>
                    {
                        item.type == 'like' && <Text style={{color:'#fff'}}>{item.sender.username} liked your post</Text>
                    }
                    {
                        item.type == 'follow' && <Text style={{color:'#fff'}}>{item.sender.username} started following you</Text>  
                    }
                    {
                        item.type == 'comment' && (
                        <>
                        <Text style={{color:'#fff'}}>{item.sender.username} comment on your post</Text>
                        <Text style={{color:'#fff'}}>{item.referenceId.content}</Text>
                        </>
                        ) 
                    }
                </View>
                <View></View>
                {
                    item.read &&
                    <View 
                    style={{position:'absolute', top:0, left:0, bottom:0, right:0, backgroundColor:'#0006'}}
                    />
                }
            </View>
        )
    }

    return(
        <View style={styles.mainContainer}>
            <Text style={styles.headerTxt}>Notification</Text>
            <FlatList
                data={data}
                renderItem={renderNotification}
                refreshControl={
                    <RefreshControl
                    refreshing={isRefresh}
                    onRefresh={fetchData}
                    />
                }
                ListEmptyComponent={()=>{
                    if(fetchErrorMsg){
                        return (
                            <Text style={{color:'#fff', textAlign:'center', paddingVertical:15}}>{fetchErrorMsg}</Text>
                        )
                    }
                    return (<></>)
                }}
                
            />
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer:{
        paddingTop: StatusBar.currentHeight || 40,
        backgroundColor:'#000',
        flex:1
    },
    headerTxt:{
        color:'#fff',
        fontSize:28,
        paddingVertical:10,
        textAlign:'center',
        borderBottomColor:'#333',
        borderBottomWidth:1
    }
})