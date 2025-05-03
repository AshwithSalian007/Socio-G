import { useCallback, useEffect, useState } from "react";
import { StatusBar, View } from "react-native";
import { GiftedChat, Send } from "react-native-gifted-chat";
// import getBardApi from "../services/ChatBotApi";
import { Ionicons } from "@expo/vector-icons";
import { getDataWithExpiry, getRandomUUID, selfUID, storeDataWithExpiry } from "../utils/Functions";
import axiosInstance from "../config/axiosConfig";
import Toast from "react-native-toast-message";


export default function AiChatScreen ({navigation, route}) {
    const [selfID, setSelfID] = useState(null);
    const params = route.params;
    const [selectedChatFace, setSelectedChatFace] = useState(params.selectedFace);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if(selfID != null && messages.length > 0) {
            storeDataWithExpiry(selfID + "AIBOT" + selectedChatFace.name, messages, 14400000);
        }
    }, [messages]);


    useEffect(() => {
        const defaultMessageSetup = () => {
            setMessages([
                {
                    _id: 1,
                    text: 'Hello, I am '+ selectedChatFace.name,
                    createdAt: new Date(),
                    user: {
                    _id: 2,
                    name: selectedChatFace.name,
                    avatar: selectedChatFace.image,
                    },
                },
                ]);
        }
        const initialFunction = async() => {
            const selfid = await selfUID();
            if(selfid != null){
                setSelfID(selfid);
                const oldMsgData = await getDataWithExpiry(selfid + "AIBOT" + selectedChatFace.name);
                if(oldMsgData != null){
                    setMessages(oldMsgData);
                } else {
                    defaultMessageSetup();
                }
            } else {
                defaultMessageSetup();
            }
        }
        initialFunction();
    }, [])

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages =>
        GiftedChat.append(previousMessages, messages),
        )
        setLoading(true);
        if(messages[0].text){
            getBardRespose(messages[0].text);
        }
    }, [])

    const getBardRespose = async(msg) => {
        try {
            const response = await axiosInstance.get('api/bardapi?ques='+msg);
            if(response.status == 200 && response.data.resp[1].content){
                const chatApiRespose = {
                    _id: getRandomUUID(),
                    text: response.data.resp[1].content,
                    createdAt: new Date(),
                    user: {
                    _id: 2,
                    name: selectedChatFace.name,
                    avatar: selectedChatFace.image,
                    },
                }
                setMessages(previousMessages => GiftedChat.append(previousMessages, chatApiRespose));
            } else {
                const chatApiRespose = {
                    _id: getRandomUUID(),
                    text: "Sorry, I can not help with it.",
                    createdAt: new Date(),
                    user: {
                    _id: 2,
                    name: selectedChatFace.name,
                    avatar: selectedChatFace.image,
                    },
                }
                setMessages(previousMessages => GiftedChat.append(previousMessages, chatApiRespose));
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
        setLoading(false);
    }

    const renderSend = (props) => {
        return (
          <Send {...props}>
            <View style={{ marginRight: 10, marginBottom: 5 }}>
              {/* <Ionicons name="send" size={32} color="#0084ff" /> */}
              <Ionicons name="send" size={32} color={selectedChatFace.primary} />
            </View>
          </Send>
        );
      };



    return (
        <View style={{flex:1, backgroundColor:'#000000', paddingTop: StatusBar.currentHeight}}>
            <GiftedChat
                messages={messages}
                isTyping={loading}
                renderSend={renderSend}
                onSend={messages => onSend(messages)}
                user={{
                _id: 1,
                }}
            />
        </View>

    )
}