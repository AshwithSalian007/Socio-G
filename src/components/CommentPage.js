import { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, StatusBar, TextInput, TouchableOpacity, Image, ActivityIndicator, FlatList, RefreshControl, Alert} from "react-native";
import Toast from "react-native-toast-message";
import axiosInstance from "../config/axiosConfig";
import { selfUID, timeAgo } from "../utils/Functions";

export default function CommentPage({navigation, route}){
    const [selfId, setSelfId] = useState(null);
    const [commentListData, setCommentListData] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [fetchError, setFetchError] = useState('');
    const [isRefresh, setIsRefresh] = useState(false);
    const [commentInput, setCommentInput] = useState('');
    const [isCommentSubmitted, setIsCommentSubmitted] = useState(false);
    const [activeComment, setActiveComment] = useState(null);


    if(!(route.params && route.params.pid)){
        return(
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text>missing route params pid {'(post id)'}</Text>
            </View>
        )
    }

    const fetchCommentsData = useCallback(
        async() => {
            setIsRefresh(true);
            setFetchError('');
            try {
                const response = await axiosInstance.get(`api/post/comment/serve/${route.params.pid}`);
                if(response.status == 200 && response.data){
                    const comments = response.data;
                    const updatedComments = comments.map(comment => ({...comment, createdAt: timeAgo(comment.createdAt)}));
                    setCommentListData(updatedComments);
                    setIsDataLoaded(true);
                }
            } catch (error) {
                if(error.response && error.response.data && error.response.data.message){
                    setFetchError(error.response.data.message);
                } else {
                    setFetchError(error.message);
                }
            }
            setIsRefresh(false);
        },
        [route.params.pid, axiosInstance, setFetchError, setIsRefresh],
      );


    useEffect(()=>{
        (async() => {
            const id = await selfUID();
            setSelfId(id);
        })();
        fetchCommentsData();
    }, [fetchCommentsData]);


    const handleCommentSubmit = useCallback(async()=>{
        if(!commentInput){
            return;
        }
        if(isCommentSubmitted){
            return;
        }
        setIsCommentSubmitted(true);
        try {
            const response = await axiosInstance.post(`api/post/comment`, {
                postId:route.params.pid,
                content: commentInput
            });
            if(response.status == 200){
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: "Commented successfully",
                    position:'top'
                });
                setCommentInput('');
                fetchCommentsData();
            }
        } catch (error) {
            if(error.response && error.response.data && error.response.data.message){
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: error.response.data.message,
                    position:'top'
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: error.message,
                    position:'top'
                });
            }
        }
        setIsCommentSubmitted(false);

    }, [commentInput, setCommentInput, axiosInstance, route.params.pid, Toast, navigation, fetchCommentsData, isCommentSubmitted, setIsCommentSubmitted])


    const deleteComment = async(cid) => {
        setIsDataLoaded(false);
        setFetchError('');
        try {
            const response = await axiosInstance.post('api/post/comment/delete', {
                commentId:cid
            })
            if(response.status == 200){
                Toast.show({
                    type: 'success',
                    text1: 'Comment Deleted Successfully',
                    position:'top'
                });
                fetchCommentsData();
            }
        } catch (error) {
            setIsDataLoaded(true);
            if(error.response && error.response.data && error.response.data.message){
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: error.response.data.message,
                    position:'top'
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: error.message,
                    position:'top'
                });
            }
        }
    }



    if(!isDataLoaded){
        return (
            <View style={styles.mainContainer}>
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    {fetchError ? 
                    <Text style={{color:'#fff'}}>{fetchError}</Text>
                    : 
                    <ActivityIndicator color="#ffffff" size={'large'} />
                    }
                </View>
            </View>
        );
    }


    const commentComponentRender = ({item}) => {
        return (
                <TouchableOpacity 
                activeOpacity={(item.userId == selfId ? 0.75 : 1)}
                onLongPress={()=>{
                    if(item.userId == selfId){
                        setActiveComment(item._id);
                    }
                }}
                onPress={()=>{
                    if(item._id == activeComment){
                        setActiveComment(null);
                    }
                }}
                
                >
                <View style={[{ paddingHorizontal:15, paddingTop:10, paddingBottom:5 , borderBottomWidth:1, borderBottomColor:'#252525', flexDirection:'row', gap:10, position:'relative'}, {backgroundColor: (item._id == activeComment ? '#8009' : '#0000')}]}>
                    <View>
                        <Image
                        source={{uri: item.profileImageUrl}}
                        style={{width:50, height:50, borderRadius: 25, marginVertical:8}}
                        />
                    </View>
                    <View style={{flex:1}}>
                        <Text style={{color:'#fff', fontWeight:'700'}}>{item.username}</Text>
                        <Text style={{color:'#c5c5c5', fontSize:13.5}}>{item.content}</Text>
                        <Text style={{color:'#555', fontSize:12, paddingTop:5}}>{item.createdAt}</Text>
                    </View>

                    {
                        item._id == activeComment 
                        &&
                        <TouchableOpacity
                        style={{position:'absolute', backgroundColor:'#fff', padding:9, top:18, right:18, zIndex:99, borderRadius:12}}
                        onPress={()=>{
                            setActiveComment(null);
                            Alert.alert(
                                'Delete Comment',
                                'Do you want to delete this comment?',
                                [
                                {
                                    text:'cancel',
                                    onPress: () => {

                                    },
                                    style: 'cancel'
                                },
                                {
                                    text: 'OK',
                                    onPress: () => {
                                        deleteComment(item._id);
                                    },
                                },
                                ],
                                { cancelable: false }
                            );
                        }}
                        >
                            <Image
                            source={require('./../../assets/bin.png')}
                            style={{width:26, height:26, tintColor:'#000'}}
                            />
                        </TouchableOpacity>
                    }
                </View>
                </TouchableOpacity>
        );
    }



    return (
        <View style={styles.mainContainer}>
            <Text style={{color:'#fff', fontSize:20, fontWeight:'500', textAlign:'center', marginTop:10}}>Comments</Text>
            <View style={styles.commentsContainer}>
                <FlatList
                data={commentListData}
                renderItem={commentComponentRender}
                ListEmptyComponent={()=>(<Text style={styles.commentEmptyTxt}>No comments yet</Text>)}
                refreshControl={
                    <RefreshControl
                    refreshing={isRefresh}
                    onRefresh={fetchCommentsData}
                    
                    />
                }
                />
            </View>
            <View style={styles.cmntInptContainer}>
                <TextInput 
                style={styles.commentInput} placeholder="Comment" placeholderTextColor='#555'
                value={commentInput}
                onChangeText={(text)=>{setCommentInput(text)}}
                maxLength={500}
                />
                {
                    commentInput.length > 0 &&
                    (
                        
                        <TouchableOpacity 
                        style={styles.cmntUploadImgCntainer}
                        onPress={handleCommentSubmit}
                        >
                            {
                                isCommentSubmitted ?
                                <ActivityIndicator color="#999" size={'small'} />
                                :
                                <Image
                                    style={styles.cmntUploadImg}
                                    source={require('./../../assets/upload-button-icon.png')}
                                />
                            }
                        </TouchableOpacity>
                    )
                
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        paddingTop: StatusBar.currentHeight || 40,
        backgroundColor: '#191919',
        flex:1
    },
    commentsContainer: {
        flex:1,
        marginTop:10,
        paddingTop:10,
        borderTopWidth:2,
        borderColor:'#333',
    },
    cmntInptContainer:{
        position:'relative'
    },
    commentInput:{
        backgroundColor:'#00000070',
        color:'#fff',
        fontSize:15,
        paddingLeft:15,
        paddingRight:45,
        paddingVertical:15,
        
    },
    cmntUploadImgCntainer:{
        position:'absolute',
        top:0,
        right:0,
        bottom:0,
        justifyContent:'center',
        padding:15
    },
    cmntUploadImg: {
        tintColor:'#999',
        width:24,
        height:24
    },
    commentEmptyTxt:{
        color:'#ccc',
        fontSize:17,
        textAlign:'center',
        paddingVertical:10
    }
});