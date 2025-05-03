import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CustomAlert = ({ visible, onClose, title, message, onCancel, onSuccess, successText= "OK" }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose || onCancel}>
      <View style={styles.container}>
        <View style={styles.alert}>
          {title && <Text style={styles.title}>{title}</Text>}
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.successBtn} onPress={onSuccess}><Text style={styles.successTxt}>{successText}</Text></TouchableOpacity>
            {onCancel && <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}><Text style={styles.cancelTxt}>Cancel</Text></TouchableOpacity>}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  alert: {
    backgroundColor: '#444',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'#fff'
  },
  message: {
    marginBottom: 20,
    color:'#fff'
  },
  buttons: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  successBtn: {
    backgroundColor: '#ffffff',
    paddingVertical:8,
    paddingHorizontal:16,
    borderRadius:8
  },
  cancelBtn: {
    backgroundColor: '#ffffff',
    paddingVertical:8,
    paddingHorizontal:16,
    borderRadius:8
  },
  successTxt: {
    color:'#000',
    fontWeight:'500'
  }, 
  cancelTxt: {
    color:'#000',
    fontWeight:'500'
  }
  
});

export default CustomAlert;
