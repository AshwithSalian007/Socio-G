import { useState } from "react";
import { View, Text, StyleSheet, StatusBar, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";
import axiosInstance from "../config/axiosConfig";

export default function ReportPage({navigation, route}) {
    const [reason, setReason] = useState('');
    const [reasonError, setReasonError] = useState('');
    const [isReportSubmitted, setIsReportSubmitted] = useState(false);

    if(!(route.params && route.params.type && route.params.id && (route.params.type == 'post' || route.params.type == 'user'))){
        return (
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text>Required params are missing {'(type : "post" or "user", id: reference id to report)'}</Text>
            </View>
        );
    }

    const handleReasonChange = (text) => {
        const lines = text.split('\n');
        if (lines.length <= 30) {
            setReason(text);
        }
    }

    const handleReportSubmit = async() => {
        if(isReportSubmitted){
            return;
        }
        setIsReportSubmitted(true);
        setReasonError('');
        
        if(!reason){
            setReasonError('Provide reason for the report');
            setIsReportSubmitted(false);
            return;
        }

        // Toast.show({
        //     type: 'success', // 'success', 'error', 'info'
        //     position: 'top', // 'top', 'bottom'
        //     text1: 'Hello',
        //     text2: 'This is a toast message 👋',
        //     visibilityTime: 4000, // duration in milliseconds
        //     autoHide: true,
        //     topOffset: 30, // offset from the top
        //     bottomOffset: 40, // offset from the bottom
        //     onShow: () => {}, // callback when toast is shown
        //     onHide: () => {}, // callback when toast is hidden
        //     onPress: () => {} // callback when toast is pressed
        // });

        try {
            if(route.params.type == 'post'){
                const response = await axiosInstance.post(`api/post/report`, {
                    postId:route.params.id,
                    reason
                });
                if(response.status == 200){
                    Toast.show({
                        type: 'success',
                        text1: 'Success',
                        text2: "Reported the post successfully",
                        position:'top'
                    });
                    navigation.pop();
                }
            } else {
                const response = await axiosInstance.post(`api/user/report`, {
                    userId:route.params.id,
                    reason
                });
                if(response.status == 200){
                    Toast.show({
                        type: 'success',
                        text1: 'Success',
                        text2: "Reported the user successfully",
                        position:'top'
                    });
                    navigation.pop();
                }
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
        setIsReportSubmitted(false);
    }

    return (
        <View style={styles.mainContainer}>
            <Text style={styles.headingTxt}>Report {route.params.type}</Text>
            <TextInput
            style={styles.reasonInput}
            placeholder="Reason"
            placeholderTextColor="#444"
            value={reason}
            onChangeText={handleReasonChange}
            maxLength={500}
            multiline={true}
            />
            {reasonError && <Text style={styles.reasonError}>{reasonError}</Text>}
            <View style={styles.bottomContainer}>
                <TouchableOpacity 
                style={styles.reportBtn}
                onPress={handleReportSubmit}
                >
                    {
                        isReportSubmitted ?
                        <ActivityIndicator color="#000" size={'small'} />
                        :
                        <Text style={{fontSize:18, fontWeight:'500'}}>Report</Text>
                    }
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer:{
        backgroundColor:'#000',
        paddingTop: StatusBar.currentHeight || 40,
        flex:1,
    },
    headingTxt:{
        color:'#fff',
        fontSize:28,
        textAlign:'center',
        marginTop:20
    },
    reasonInput:{
        color:'#ddd',
        borderWidth:1,
        borderColor:'#333',
        marginHorizontal:15,
        marginTop:50,
        paddingVertical:5,
        paddingHorizontal:10,
        borderRadius:3,
        height:180,
        fontSize:16,
        textAlignVertical: 'top'
    },
    bottomContainer:{
        flex:1,
        paddingHorizontal:30,
        paddingVertical:50,
        justifyContent:'flex-end',
        alignItems:'flex-end'
    },
    reportBtn:{
        backgroundColor:'#fff', 
        paddingVertical:5, 
        paddingHorizontal:20, 
        borderRadius:3,
        justifyContent:'center',
        alignItems:'center',
        height:36,
        width:110
    },
    reasonError:{
        color:'#f00',
        paddingHorizontal:15
    }
})