import { FlatList, Image, StyleSheet, Text, View, StatusBar, TouchableOpacity, Dimensions } from 'react-native';
import AiChatFaceData from '../utils/AiChatFaceData';
import { useState } from 'react';

export default function AiChatHome({navigation}) {
  const [chatFaceData, setChatFaceData] = useState(AiChatFaceData);
  const [selectedChatFaceData, setSelectedChatFaceData] = useState(AiChatFaceData[0]);

  const onChatFacePress = (index) => {
    setSelectedChatFaceData(chatFaceData[index]);
  }
  return (
    <View style={styles.container}>
      <Text style={[{color: selectedChatFaceData.primary}, {fontSize:30, marginTop:60}]}>Hello</Text>
      <Text style={[{color: selectedChatFaceData.primary}, {fontSize:30, fontWeight:'bold'}]}>I am {selectedChatFaceData.name}</Text>

      <Image 
      source={{ uri:selectedChatFaceData.image }}  
      style={{width:150, height:150, marginTop:20}}
      />
      <Text style={{marginTop:30, fontSize:25, color:'#ffffff'}}>How can I help you?</Text>
      <View style={{marginTop:20, backgroundColor:'#252525', alignItems:'center', height:110, padding:10, borderRadius:6}}>
        <FlatList
         data={chatFaceData}
         horizontal={true}
         renderItem={({item, index}) => selectedChatFaceData.id != item.id && (
            <TouchableOpacity style={{margin:15}} onPress={()=> onChatFacePress(index)}>
              <Image source={{uri:item.image}}
              style={{width:40, height:40}}
              />
            </TouchableOpacity>
         )}
         />
         <Text style={{fontSize:17, color:'#b0b0b0'}}>Choose Your Fav ChatBuddy</Text>
      </View>
      <TouchableOpacity 
      onPress={()=> navigation.navigate('aiChatScreen', {selectedFace: selectedChatFaceData})}
      style={[{backgroundColor:selectedChatFaceData.primary}, {padding:17, width:Dimensions.get('screen').width * 0.6, borderRadius:100, alignItems:'center', marginTop:30}]}>
        <Text style={{fontSize:16, color:'#fff', fontWeight:'bold'}}>Let's Chat</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems:'center',
    backgroundColor:'#000',
    paddingTop:StatusBar.currentHeight || 40,
    flex:1
  }
});
