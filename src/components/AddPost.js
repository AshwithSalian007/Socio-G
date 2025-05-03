import { Text, View, StyleSheet, StatusBar, Image, TouchableOpacity, ScrollView, Dimensions, TextInput, Alert, ActivityIndicator } from "react-native";
import BottomNavigation from "./BottomNavigation";
import { useEffect, useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import { Video } from "expo-av";
import * as FileSystem from 'expo-file-system';
import axiosInstance from "../config/axiosConfig";
import Toast from "react-native-toast-message";




export default function AddPost({navigation}){
    const [bottomNavigationHeight, setBottomNavigationHeight] = useState(0);
    const [content, setContent] = useState(null);
    const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
    const [postCaption, setPostCaption] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadDone, setIsUploadDone] = useState(false);





    const PickPost = async() => {
        try {
            
            await ImagePicker.requestMediaLibraryPermissionsAsync();
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect:[1,1],
                quality: 1,
            });
            

            if(!result.canceled) {
                if(result.assets[0].type == "video" && result.assets[0].duration > 300000){
                    Alert.alert(
                        'Long Video',
                        'Video is longer then 5 Minutes. Pick shorter video.',
                        [
                        {
                            text: 'OK',
                            onPress: () => {
                                navigation.goBack();
                            },
                        },
                        ],
                        { cancelable: false }
                    );
                } else {
                    setContent(result.assets[0]);
                }

            } else {
                navigation.goBack();
            }
        } catch (error) {
            alert("Error while picking media: " + error.message);
        }
    }

    useEffect(()=> {
        PickPost();
    },[]);



    const handleCaptionChange = (Text) => {
        // Split the text into lines
        const lines = Text.split('\n');
        if (lines.length <= 12) {
            setPostCaption(Text);
        }
    }

    const handlePostUpload = async() => {
        try {
            setIsLoading(true);
            const fileInfo = await FileSystem.getInfoAsync(content.uri);
            const fileName = content.uri.substring(content.uri.lastIndexOf('/') + 1);
            if(!fileInfo.exists){
                setIsLoading(false);
                alert(content.type + ' file is missing');
                return;
            }
            const formData = new FormData();
            formData.append('file', {
                uri: content.uri,
                name: fileName,
                type: content.mimeType,
            });
            formData.append('category', content.type);
            formData.append('description', postCaption);

            const response = await axiosInstance.post(`api/post/upload`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
            });
            if(response.status == 201){
                setIsUploadDone(true);
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
                })
            }
        }
        setIsLoading(false);
    }


    if(isUploadDone){
        return (
            <View style={[styles.mainContainer, {paddingBottom: bottomNavigationHeight, justifyContent:'center', alignItems:'center'}]}>
                <Text style={{color:'#dddddd', fontSize: 15, textAlign:'center'}}>
                    Uploaded Post Successfully
                </Text>
                <TouchableOpacity 
                style={{backgroundColor:'#ffffff', paddingVertical:3, paddingHorizontal:15, borderRadius:4, marginTop:20}}
                onPress={() => {
                    navigation.navigate('home');
                }}
                >
                    <Text style={{color:'#333333', fontSize: 20, textAlign:'center', fontWeight:'700'}}>
                        Done
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }


    return(
        <View style={[styles.mainContainer, {paddingBottom: bottomNavigationHeight}]}>
            { 
            isLoading && 
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={{color:'#aaaaaa', marginTop:10}}>Uploading</Text>
            </View>
            }
            {
            !isLoading &&
            
            <ScrollView>
                <View><Text style={{color:'#ffffff', fontSize:26, fontWeight:'600', textAlign:'center', paddingTop: 10}}>New Post</Text></View>
                {
                content != null &&
                (
                    <View>
                        <View style={{width:screenWidth, height:screenWidth}}>
                        {content.type == "image" ? 
                        (
                            <Image
                            source={{uri: content.uri}}
                            style={{width:'100%', height:'100%', resizeMode:'contain'}}
                            />
                        ) : (
                            <Video
                            source={{uri: content.uri}}
                            style={{width:'100%', height:'100%', backgroundColor:'#000'}}
                            resizeMode='contain'
                            useNativeControls={true}
                            />
                        )}
                        </View>
                        <View style={{marginTop:20, paddingVertical:20, paddingHorizontal:10}}>
                            <TextInput 
                            style={{color:'#bbb', paddingHorizontal:15, borderWidth:2, borderColor:'#292929', borderRadius:8}} 
                            value={postCaption} 
                            placeholder="Write a caption"
                            placeholderTextColor="#555"
                            multiline={true}
                            maxLength={500}
                            onChangeText={handleCaptionChange}
                            />
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center', justifyContent:"flex-end", paddingHorizontal:15}}>
                            <TouchableOpacity style={{backgroundColor:'#1f7eff', paddingVertical:6, paddingHorizontal:25, borderRadius:5}} onPress={handlePostUpload}>
                                <Text style={{color:'#ffffff', fontSize:18, fontWeight:'600'}}>POST</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                )
                }
            </ScrollView>
            }
        <BottomNavigation componentHightSetter={setBottomNavigationHeight}/>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer:{
        flex: 1,
        backgroundColor:'#000',
        paddingTop:(StatusBar.currentHeight || 40),
        // justifyContent:'center',
        alignItems:'center'
    }
});