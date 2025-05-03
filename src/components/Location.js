import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, ActivityIndicator, StatusBar, TouchableOpacity, Alert } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import darkMapStyle from './../utils/MapStyle';
import BottomNavigation from "./BottomNavigation";
import axiosInstance from "../config/axiosConfig";


const Location = ({navigation}) => {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [usersLocationData, setUsersLocationData] = useState([]);
  const [myLocationData, setMyLocationData] = useState(null);
  const [bottomNavigationHeight, setBottomNavigationHeight] = useState(0);

  const [mapRegion, setMapRegion] = useState({
    latitude: 15.972442,
    longitude: 77.580643,
    latitudeDelta: 12.0922,
    longitudeDelta: 15.0421,
  })

  

  const fetchFriendsLocation = async() => {
    setFetchError('');
    setIsDataLoaded(false);
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`api/location/all`);
      if(response.data){
          setUsersLocationData(response.data);
          // setIsDataLoaded(true);
      }
    } catch (error) {
        if(error.response && error.response.data && error.response.data.message){
            setFetchError(error.response.data.message);
        } else {
            setFetchError(error.message);
        }
        setIsLoading(false);
        return;
    }
    try {
      const response = await axiosInstance.get(`api/location/my`);
      if(response.data){
          setMyLocationData(response.data);
      }
    } catch (error) {
      if(error.response && error.response.data && error.response.data.message){
          setFetchError(error.response.data.message);
      } else {
          setFetchError(error.message);
      }
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setIsDataLoaded(true);


  }

  useEffect(()=>{
    fetchFriendsLocation();
  }, []);



  const deleteLocation = async() => {
    setFetchError('');
    setIsDataLoaded(false);
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`api/location/delete`);
      if(response.status == 200){
        setMyLocationData(null);
        setIsDataLoaded(true)
      }
    } catch (error) {
      if(error.response && error.response.data && error.response.data.message){
          setFetchError(error.response.data.message);
      } else {
          setFetchError(error.message);
      }
    }
    setIsLoading(false);
  }



  const dataLoadingAnimation = () => {
    return(
        <View style={styles.loadingContainer}>
            {isLoading && <ActivityIndicator size='large' color='#ffffff'/>}
            {fetchError && <Text style={{color:'#ffffff'}}>{fetchError}</Text>}
        </View>
    );
  }



  return (
    <View style={[ styles.mainContainer]}>
      {
        !isDataLoaded? 
        dataLoadingAnimation() 
        : 
        <>
        <MapView
          zoomEnabled={true}
          provider={PROVIDER_GOOGLE}
          customMapStyle={darkMapStyle}
          style={{ width: "100%", height: "100%" }}
          region={mapRegion}
          showsCompass={true}
          initialRegion={{
            latitude: 20.972442,
            longitude: 81.580643,
            latitudeDelta: 12.0922,
            longitudeDelta: 15.0421,
          }}
        >
          
          {usersLocationData.map((user) => (
            <Marker
              key={user._id}
              title={user.username}
              description={user.description}
              coordinate={{
                latitude: parseFloat(user.latitude),
                longitude: parseFloat(user.longitude),
              }}
            >
              <Image
                source={{ uri: user.bitmoji }}
                style={{ width: 100, height: 100, resizeMode: "cover" }}
              />
            </Marker>
          ))}
          {
            myLocationData 
            &&
            <Marker
              title={myLocationData.username}
              description={myLocationData.description}
              coordinate={{
                latitude: parseFloat(myLocationData.latitude),
                longitude: parseFloat(myLocationData.longitude),
              }}
              >
              <Image
                source={{ uri: myLocationData.bitmoji }}
                style={{ width: 100, height: 100, resizeMode: "cover" }}
              />
            </Marker>
          }
        </MapView>

        {
          myLocationData ? 
          <TouchableOpacity style={[styles.shareMylctnBtn, {bottom: (bottomNavigationHeight + 10)}]} activeOpacity={0.6} onPress={()=>{
            Alert.alert(
              'Alert',
              'Are you sure you want to delete?',
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
                  deleteLocation();
                  },
              },
              ],
              { cancelable: false }
          );
          }}>
            <Text style={styles.shareMylctnTxt}>Delete my Location </Text>
            <Image source={require('./../../assets/nav-location-icon.png')} style={styles.shareLocationIcon} />
          </TouchableOpacity>
          :
          <TouchableOpacity style={[styles.shareMylctnBtn, {bottom: (bottomNavigationHeight + 10)}]} activeOpacity={0.6} onPress={()=>{navigation.navigate('shareLocation')}}>
            <Text style={styles.shareMylctnTxt}>Share my Location </Text>
            <Image source={require('./../../assets/nav-location-icon.png')} style={styles.shareLocationIcon} />
          </TouchableOpacity>
        }


        <TouchableOpacity activeOpacity={1} style={[styles.friendsBx, {bottom: bottomNavigationHeight}]}>
          <Image source={require('./../../assets/friends-group-bitmoji.jpeg')} style={{width:60, height:60, borderRadius:35}}/>
          <Text style={styles.sharedLctnTxt}>Shared{'\n'+usersLocationData.length}</Text>
        </TouchableOpacity>
        </>
      }
      <BottomNavigation componentHightSetter={setBottomNavigationHeight}/>
    </View>
  );
};

export default Location;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#000000',
    paddingTop:(StatusBar.currentHeight || 40),
    flex: 1
  },
  loadingContainer:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  shareMylctnBtn: {
    position:'absolute',
    left:15,
    bottom:0,
    backgroundColor: '#fff',
    padding:10,
    borderRadius:12,
    flexDirection:'row'
  },
  shareMylctnTxt: {
    fontWeight:'500'
  },
  shareLocationIcon: {
    width: 20,
    height: 20,
    tintColor: '#b04040'
  },
  friendsBx:{
    position:'absolute',
    bottom:0,
    right: 0,
    marginHorizontal:15,
    marginVertical:20
  },
  sharedLctnTxt: {
    backgroundColor:'#fff',
    paddingHorizontal:2,
    borderRadius:12,
    fontSize:12,
    left:0,
    right:0,
    fontWeight:'500',
    position:'absolute',
    bottom:-10,
    textAlign:'center'
  }
});
