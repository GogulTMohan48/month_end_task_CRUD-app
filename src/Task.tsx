
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, Text, Button, Image, Platform, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { addTask, initializeTasks } from './redux/tasksSlice';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { faClock as faRegularClock } from '@fortawesome/free-regular-svg-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Task() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [taskName, setTaskName] = useState('');
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState(null);
  const [dateDisplay, setDateDisplay] = useState('');
  const [beginningTime, setBeginningTime] = useState('');
  const [beginningTimeDisplay, setBeginningTimeDisplay] = useState('');
  const [finishedTime, setFinishedTime] = useState('');
  const [finishedTimeDisplay, setFinishedTimeDisplay] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showBeginningTimePicker, setShowBeginningTimePicker] = useState(false);
  const [showFinishedTimePicker, setShowFinishedTimePicker] = useState(false);
  const [isImageVisible, setIsImageVisible] = useState(true);

  useEffect(() => {
    dispatch(initializeTasks());
  }, [dispatch]);

  useEffect(() => {
    const loadTaskData = async () => {
      try {
        const savedTaskName = await AsyncStorage.getItem('taskName');
        const savedSubject = await AsyncStorage.getItem('subject');
        const savedDate = await AsyncStorage.getItem('date');
        const savedBeginningTime = await AsyncStorage.getItem('beginningTime');
        const savedFinishedTime = await AsyncStorage.getItem('finishedTime');

        if (savedTaskName) setTaskName(savedTaskName);
        if (savedSubject) setSubject(savedSubject);
        if (savedDate) {
          setDate(new Date(savedDate));
          setDateDisplay(savedDate);
        }
        if (savedBeginningTime) {
          setBeginningTime(savedBeginningTime);
          setBeginningTimeDisplay(savedBeginningTime);
        }
        if (savedFinishedTime) {
          setFinishedTime(savedFinishedTime);
          setFinishedTimeDisplay(savedFinishedTime);
        }
      } catch (error) {
        console.error('Failed to load task data', error);
      }
    };

    loadTaskData();
  }, []);

  const saveTaskData = async () => {
    try {
      await AsyncStorage.setItem('taskName', taskName);
      await AsyncStorage.setItem('subject', subject);
      await AsyncStorage.setItem('date', date ? date.toISOString().split('T')[0] : '');
      await AsyncStorage.setItem('beginningTime', beginningTime);
      await AsyncStorage.setItem('finishedTime', finishedTime);
    } catch (error) {
      console.error('Failed to save task data', error);
    }
  };

  const clearTaskData = async () => {
    try {
      await AsyncStorage.removeItem('taskName');
      await AsyncStorage.removeItem('subject');
      await AsyncStorage.removeItem('date');
      await AsyncStorage.removeItem('beginningTime');
      await AsyncStorage.removeItem('finishedTime');
    } catch (error) {
      console.error('Failed to clear task data', error);
    }
  };

  const handleButtonClick = () => {
    const newTask = {
      id: Date.now(),
      taskName,
      subject,
      date: date ? date.toISOString().split('T')[0] : '',
      beginningTime,
      finishedTime,
    };

    dispatch(addTask(newTask));
    setTaskName('');
    setSubject('');
    setDate(null);
    setDateDisplay('');
    setBeginningTime('');
    setBeginningTimeDisplay('');
    setFinishedTime('');
    setFinishedTimeDisplay('');
    setIsImageVisible(true);
    clearTaskData();
    navigation.navigate('Last');
  };

  const handleDateChange = (event, selectedDate) => {
    if (event.type === 'set') {
      const currentDate = selectedDate || date;
      setShowDatePicker(Platform.OS === 'ios');
      setDate(currentDate);
      setDateDisplay(currentDate.toISOString().split('T')[0]);
      saveTaskData();
    } else {
      setShowDatePicker(false);
    }
  };

  const handleBeginningTimeChange = (event, selectedTime) => {
    if (event.type === 'set') {
      const currentTime = selectedTime || new Date();
      setShowBeginningTimePicker(Platform.OS === 'ios');
      setBeginningTime(currentTime.toTimeString().split(' ')[0].slice(0, 5));
      setBeginningTimeDisplay(currentTime.toTimeString().split(' ')[0].slice(0, 5));
    } else {
      setShowBeginningTimePicker(false);
    }
  };

  const handleFinishedTimeChange = (event, selectedTime) => {
    if (event.type === 'set') {
      const currentTime = selectedTime || new Date();
      setShowFinishedTimePicker(Platform.OS === 'ios');
      setFinishedTime(currentTime.toTimeString().split(' ')[0].slice(0, 5));
      setFinishedTimeDisplay(currentTime.toTimeString().split(' ')[0].slice(0, 5));
    } else {
      setShowFinishedTimePicker(false);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../assets/image3.png')}
        style={[styles.image, styles.underImage]}
      />
      <ImageBackground
        source={require('../assets/pen.png')}
        style={[styles.image, styles.overImage]}
      />
      <View style={styles.inputContainer}>
        <Text style={styles.inputHeading}>Task Name</Text>
        <View style={styles.inputWithIcon}>
          {isImageVisible && (
            <Image source={require('../assets/first.png')} style={styles.icon} />
          )}
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              setTaskName(text);
              saveTaskData();
              setIsImageVisible(text === '');
            }}
            onBlur={() => {
              if (taskName === '') {
                setIsImageVisible(true);
              }
            }}
            value={taskName}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputHeading}>Subject</Text>
        <View style={styles.inputWithIcon}>
          {isImageVisible && (
            <Image source={require('../assets/image.png')} style={styles.icon} />
          )}
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              setSubject(text);
              saveTaskData();
              setIsImageVisible(text === '');
            }}
            onBlur={() => {
              if (subject === '') {
                setIsImageVisible(true);
              }
            }}
            value={subject}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputHeading}>Date</Text>
        <View style={styles.inputWithIcon}>
          {isImageVisible && (
            <Image source={require('../assets/threedot.png')} style={styles.icon} />
          )}
          <TextInput
            style={styles.input}
            onFocus={() => setShowDatePicker(true)}
            value={dateDisplay}
            showSoftInputOnFocus={false}
          />
          {showDatePicker && (
            <DateTimePicker
              value={date || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>
      </View>

      <View style={styles.two}>
        <View style={[styles.inputContainerlast, styles.firstInput]}>
          <Text style={styles.inputHeading}>Beginning Time</Text>
          <FontAwesomeIcon icon={faRegularClock} size={30} color="#734BF9" style={styles.clock} />
          <View style={styles.inputWithIcontwo}>
            <TextInput
              style={styles.inputlast}
              onFocus={() => setShowBeginningTimePicker(true)}
              value={beginningTimeDisplay}
              showSoftInputOnFocus={false}
            />
            {showBeginningTimePicker && (
              <DateTimePicker
                value={beginningTime ? new Date(new Date().setHours(beginningTime.split(':')[0], beginningTime.split(':')[1])) : new Date()}
                mode="time"
                display="default"
                onChange={handleBeginningTimeChange}
              />
            )}
          </View>
        </View>
        <View style={styles.inputContainerlast}>
          <Text style={styles.inputHeading}>Finished Time</Text>
          <FontAwesomeIcon icon={faRegularClock} size={30} color="#734BF9" style={styles.clock} />
          <View style={styles.inputWithIcontwo}>
            <TextInput
              style={styles.inputlast}
              onFocus={() => setShowFinishedTimePicker(true)}
              value={finishedTimeDisplay}
              showSoftInputOnFocus={false}
            />
            {showFinishedTimePicker && (
              <DateTimePicker
                value={finishedTime ? new Date(new Date().setHours(finishedTime.split(':')[0], finishedTime.split(':')[1])) : new Date()}
                mode="time"
                display="default"
                onChange={handleFinishedTimeChange}
              />
            )}
          </View>
        </View>
      </View>

            <View style={styles.btn}>
        <Button title='Add task' color="#734BF9" onPress={handleButtonClick} />
      </View>
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#D3D3D3',
  },
  inputContainer: {
    marginVertical: 10,
    width: '114%',
    marginTop: -20,
  },
  inputHeading: {
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 15,
    padding: 10,
    width: '86%',
  },
  two: {
    flexDirection: 'row',
  },
  firstInput: {
    marginRight: 5,
  },
  inputContainerlast: {
    width: "50%",
  },
  btn: {
    alignSelf: 'center',
    marginTop: 50,
    width: 340,
    borderRadius: 15,
    margin: 10,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    position: 'relative',
    padding: 10,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 1,
    position: 'absolute',
    alignItems: 'center',
    zIndex: 1,
    left: 10,
    marginLeft: 15,
  },
  inputlast: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 15,
    padding: 10,
    width: '80%',
    marginTop: 7,
    marginLeft: 2,
  },
  clock: {
    marginTop: 10,
    marginLeft: '25%',
  },
  inputWithIcontwo: {
    width: '107%',
    marginLeft: 8,
  },
    underImage: {
 width: 300,
    height: 300,
    transform: [{ rotate: '90deg' }],
    marginLeft: 100,
    marginTop: -25,
  },   
    overImage: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    top: -200,
    marginBottom: -100,
    marginLeft: 20,
  },
  image:{}  
});
