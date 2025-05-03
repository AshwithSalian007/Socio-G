import React, { useState } from 'react';
import { View, Platform, Button, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const PlatformIndependentDatePicker = () => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const showPlatformDatePicker = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <View>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      <Button title="Select Date" onPress={showPlatformDatePicker} />
      <Text>{`Selected Date: ${date.toLocaleDateString()}`}</Text>
    </View>
  );
};

export default PlatformIndependentDatePicker;
