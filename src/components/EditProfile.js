import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert } from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import axiosInstance from '../config/axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';




export default function EditProfile({navigation}){
    const [token, setToken] = useState('');
    const [previousData, setPreviousData] = useState({});
    const [dataLoaded, setDataLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [dataSubmitted, setDataSubmitted] = useState(false);
    const [fetchError, setFetchError] = useState(null);


    const placeHolderColor = '#444444';
    const [loading, setLoading] = useState(false);
    const [profileEditFlag, setProfileEditFlag] = useState(false);


    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [profession, setProfession] = useState('');
    const [bio, setBio] = useState('');
    const [profileImgUri, setProfileImgUri] = useState('');
    const [imageUpdated, setImageUpdated] = useState(false);

    


    const [usernameError, setUsernameError] = useState('');
    const [nameError, setNameError] = useState('');

    const getData = async() => {
        // let tkn = await AsyncStorage.getItem('token');
        // setToken(tkn);
        try {
            const result = await axiosInstance.get('api/user/profile/');
            if(result.status === 200 && result.data){
                setIsLoading(false);
                setPreviousData(result.data);
                setDataLoaded(true);
                setUsername(result.data.username);
                setName(result.data.name);
                setProfession(result.data.profession);
                setBio(result.data.bio);
                setProfileImgUri(result.data.profileUri)

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

    useEffect(()=>{
        getData();
    }, [])



    //validate input
    const validateUsername = () => {
        if(!username){
            setUsernameError('Username is required');
        }
        else if(username.includes(' ')){
            setUsernameError('Username cannot contain space. use _ or .');
        }
        else if(!/^[a-zA-Z0-9_.]*$/.test(username)){
            setUsernameError('Only letters, numbers, _ and . are allowed.');
        }
        else if(username.length < 4){
            setUsernameError('Username must be at least 4 characters long');
        }
        else {
            setUsernameError('');
            return true;
        }
        return false;
    }

    //validate
    const validateName = (name) => {
        const namePattern = /^[a-zA-Z0-9_\s.]*$/;
        
        return namePattern.test(name);
    }

    //handle input
    //handle change
    const handleNameChange = (Text) => {
        setName(Text);
    }


    const handleUsernameChange = (inputText) => {
        const Text = inputText.toLowerCase();
        // Check if input text contains spaces
        if (Text.includes(' ')) {
            // If space is found, show error message  
            setUsernameError('Username cannot contain space. use _ or .');
        }
        else if(!/^[a-zA-Z0-9_.]*$/.test(Text)){
            setUsernameError('Only letters, numbers, _ and . are allowed.');
        }
        else {
            // If no space, update input text
            setUsernameError('');
            setUsername(Text);
        }
    }

    const handleProfessionChange = (Text) => {
        setProfession(Text);
    }

    const handleBioChange = (Text) => {
        // Split the text into lines
        const lines = Text.split('\n');
        if (lines.length <= 6) {
            setBio(Text);
        }
    }






    const handleOnSubmit = async() => {
        setDataSubmitted(true);
        setLoading(true);
        setNameError('');
        setUsernameError('');

        

        if(!validateName(name)){
            setLoading(false); 
            setDataSubmitted(false);
            setNameError('Name connot contain special character. you can use _ and .');
            return;
        } else if(!name){
            setLoading(false);
            setDataSubmitted(false);
            setNameError('Name is required');
            return;
        }

        if(!validateUsername()){
            setLoading(false);
            setDataSubmitted(false);
            return;
        }

        if(previousData.username != username){        
            try {
                let response = await axiosInstance.post('api/auth/check/username', {username});
                if(response.status === 200){
                    setUsernameError('Username already exists');
                    setLoading(false);
                    setDataSubmitted(false);
                    return;
                }
            } catch (error) {
                if(error.response && error.response.status == 404){

                } else {
                    alert(error.message);
                    setLoading(false);
                    setDataSubmitted(false);
                    return;
                }
            }
        }






        if(imageUpdated){
            if(profileImgUri){
                try {
                    const imageInfo = await FileSystem.getInfoAsync(profileImgUri);
                    const fileName = profileImgUri.substring(profileImgUri.lastIndexOf('/') + 1);
                    const fileType = 'image/' + profileImgUri.substring(profileImgUri.lastIndexOf('.') + 1);
                    if(!imageInfo.exists){
                        setLoading(false);
                        setDataSubmitted(false);
                        alert('Image file is missing');
                        return;
                    }
                    
                    const formData = new FormData();
                    formData.append('image', {
                      uri: profileImgUri,
                      name: fileName,
                      type: fileType,
                    });
              
                    const response = await axiosInstance.post(`api/user/profile/update/upload`, formData, {
                      headers: {
                        'Content-Type': 'multipart/form-data',
                      },
                    });

                    
                  } catch (error) {
                    setLoading(false);
                    setDataSubmitted(false);
                    alert('Error updating profile Image: ' + error.message);
                    return;
                  }
            } else {
                try {
                    const response = await axiosInstance.post(`api/user/profile/update/upload`, {image: null});
                } catch (error) {
                    setLoading(false);
                    setDataSubmitted(false);
                    alert('Error updating profile Image: ' + error.message);
                    return;
                }
            }
        }



        try {
            const values = {
                name: name,
                username: username,
                profession: profession? profession : null,
                bio: bio? bio : null,
            }
            const response = await axiosInstance.post(`api/user/profile/update/details`, values);
        } catch (error) {
            setLoading(false);
            setDataSubmitted(false);
            alert('Error updating profile: ' + error.message);
            return;
        }







        setLoading(false);
        setDataSubmitted(false);

        navigation.pop();
        navigation.replace('Profile'); 
    }

    if(!dataLoaded){
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

    const removeImage = async() => {
        try{
            saveImage(null);
        } catch ({message}) {
            alert(message);
            setProfileEditFlag(false);
        }
    }


    const UploadImage = async(mode) => {
        try {

            let result = {};
            if(mode === "gallery"){
                await ImagePicker.requestMediaLibraryPermissionsAsync();
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect:[1, 1],
                    quality: 1,
                });
            } else {
                await ImagePicker.requestCameraPermissionsAsync();
                result = await ImagePicker.launchCameraAsync({
                    cameraType: ImagePicker.CameraType.front,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                });
            }

            if(!result.canceled) {
                //save image
                saveImage(result.assets[0].uri);

            }
        } catch (error) {
            Alert.alert("Error uplaoding image: " + error.message);
            setProfileEditFlag(false);
        }
    }

    const saveImage = async(image) => {
        try {
            setProfileImgUri(image);
            setImageUpdated(true);
            setProfileEditFlag(false);

        } catch (error) {
            throw error;
        }
    }


    const renderProfileChangeOptions = () => {
        return(
            <View style={styles.profileUploadMain}>
            <TouchableOpacity style={styles.profileUploadBackScreen} onPress={()=>{setProfileEditFlag(false)}} activeOpacity={1}/>
                <View style={styles.profileUploadOptionContainer}>
                    <Text style={styles.profileUploadHeading}>Profile Photo</Text>
                    <View style={styles.profileUploadSubBx}>
                        <TouchableOpacity style={styles.profileUploadBtnBx} onPress={()=>{UploadImage("camera")}}>
                            <Image
                                source={require('./../../assets/camera.png')}
                                style={styles.profileUploadImgBtn}
                            />
                            <Text style={{color:'#ffffff'}}>Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.profileUploadBtnBx} onPress={()=>{UploadImage("gallery")}}>
                            <Image
                                source={require('./../../assets/gallery.png')}
                                style={styles.profileUploadImgBtn}
                            />
                            <Text style={{color:'#ffffff'}}>Gallery</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.profileUploadBtnBx} onPress={()=>{removeImage()}}>
                            <Image
                                source={require('./../../assets/bin.png')}
                                style={styles.profileUploadImgBtn}
                            />
                            <Text style={{color:'#ffffff'}}>Remove</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        );
    }



    return(
        <>
        <View style={styles.mainContainer}>
            <View style={styles.headerBx}>
                <TouchableOpacity onPress={()=>{navigation.goBack()}}>
                    <Image
                    source={require('./../../assets/left-back-icon.png')}
                    style={styles.backBtnIcon}
                    />
                </TouchableOpacity>
                <Text style={styles.editProfileTxt}>Edit Profile</Text>
                <View style={styles.checkBtnBx}>
                    <TouchableOpacity onPress={()=>{handleOnSubmit()}} disabled={dataSubmitted}>
                        <Image
                        source={require('./../../assets/check-icon.png')}
                        style={styles.checkBtnIcon}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            
            <ScrollView style={styles.scrollContainer}>
            <View style={styles.profileImgBx}>
                <TouchableOpacity style={{position:'relative'}} onPress={()=>{setProfileEditFlag(true)}}  activeOpacity={0.8}>
                    <Image
                    source={profileImgUri ? {uri: profileImgUri} : require('./../../assets/profile-default.png')}
                    style={styles.profileImg}
                    />
                    <Image
                    source={require('./../../assets/pencil-icon.png')}
                    style={styles.pencil_icon}
                    />
                </TouchableOpacity>

            </View>
            <View style={styles.inputAreaCntainer}>
                <View>
                <Text style={styles.labelTxt}>Name</Text>
                <TextInput 
                    style={styles.inputTxt} 
                    placeholder='Name' 
                    placeholderTextColor={placeHolderColor} 
                    value={name}
                    maxLength={64}
                    autoCapitalize='none'
                    onChangeText={handleNameChange}
                />
                {nameError && <Text style={styles.errorTxtMessage}>{nameError}</Text>}
                </View>
                <View>
                <Text style={styles.labelTxt}>Username</Text>
                <TextInput 
                    style={styles.inputTxt} 
                    placeholder='username' 
                    placeholderTextColor={placeHolderColor} 
                    value={username}
                    maxLength={30} 
                    autoCapitalize='none'
                    onChangeText={handleUsernameChange}
                />
                {usernameError && <Text style={styles.errorTxtMessage}>{usernameError}</Text>}
                </View>
                <View>
                <Text style={styles.labelTxt}>Profession</Text>
                <TextInput 
                    style={styles.inputTxt} 
                    placeholder='Profession' 
                    placeholderTextColor={placeHolderColor} 
                    value={profession}
                    maxLength={40}
                    onChangeText={handleProfessionChange}
                />
                </View>
                <View>
                <Text style={styles.labelTxt}>Bio</Text>
                <TextInput 
                    style={styles.inputTxt} 
                    placeholder='Bio' 
                    placeholderTextColor={placeHolderColor} 
                    value={bio}
                    maxLength={200}
                    multiline={true}
                    onChangeText={handleBioChange}
                />
                </View>
                
            </View>
            </ScrollView>
            {loading && <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#0000ff" /></View>}
            {profileEditFlag && renderProfileChangeOptions()}
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    mainContainer:{
        flex:1,
        paddingTop:StatusBar.currentHeight || 40,
        backgroundColor:'#000000',
        position:'relative'
    },
    loadingContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    loadingContainer:{
        position:'absolute',
        top:0,
        left:0,
        width:'100%',
        height:'100%',
        backgroundColor:'#000000dd',
        justifyContent:'center',
        alignItems:'center'
    },
    headerBx:{
        flexDirection:'row',
        gap:15,
        alignItems:'center',
    },
    backBtnIcon:{
        width:26,
        height:26,
        tintColor:'#fff',
        marginLeft:16
    },
    editProfileTxt:{
        color:'#ffffff',
        fontSize:22,
        fontWeight:'bold'
    },
    checkBtnBx:{
        flex:1,
        alignItems:'flex-end'
    },
    checkBtnIcon:{
        width:26,
        height:26,
        tintColor:'#fff',
        marginRight:16
    },
    scrollContainer:{
        marginBottom:30
    },
    profileImgBx:{
        justifyContent:'center',
        alignItems:'center',
        padding:50
    },
    profileImg:{
        width:100,
        height:100,
        borderRadius:50,
    },
    pencil_icon:{
        position:'absolute',
        bottom:2,
        right:2,
        width:33,
        height:33,
        borderColor:'#00ABFF',
        borderWidth:2,
        borderRadius:20,
    },
    inputAreaCntainer:{
        paddingHorizontal:16
    },
    labelTxt:{
        color:'#bbbbbb',
        marginTop:20
    },
    inputTxt:{
        fontSize:18,
        color:'#ffffff',
        borderBottomColor:'#ffffff',
        borderBottomWidth:2,
        paddingBottom:5
    },
    errorTxtMessage:{
        color:'#f00'
    },
    profileUploadMain:{
        position:'absolute',
        top:0,
        left:0,
        width:'100%',
        height:'100%',
        justifyContent:'center',
        alignItems:'center'
    },
    profileUploadBackScreen:{
        position:'absolute',
        width:'100%',
        height:'100%',
        top:0,
        left:0,
        backgroundColor:'#000000bb'
    },
    profileUploadOptionContainer:{
        backgroundColor:'#aaa',
        padding:20,
        borderRadius:20
    },
    profileUploadHeading:{
        fontSize:26,
        fontWeight:'bold',
        color:'#222',
        textAlign:'center',
        paddingBottom:10,
        borderBottomWidth:2
    },
    profileUploadSubBx:{
        flexDirection:'row',
        paddingTop:30,
        paddingBottom:15,
        justifyContent:'center',
        alignItems:'center',
        gap:25

    },
    profileUploadImgBtn:{
        width:30,
        height:30,
        tintColor:'#fff'
    },
    profileUploadBtnBx:{
        backgroundColor:'#444',
        padding:14,
        borderRadius:20,
        alignItems:'center',
        minWidth:80
    }


    
})