
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, ImageBackground, ScrollView, TextInput, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './redux/store';
import { deleteTask, editTask, initializeTasks } from './redux/tasksSlice';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faClock as faRegularClock } from '@fortawesome/free-regular-svg-icons';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

const Last: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<any>({ taskName: '', subject: '', date: '', beginningTime: '', finishedTime: '' });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState({ beginningTime: false, finishedTime: false });

  useEffect(() => {
    dispatch(initializeTasks());
  }, [dispatch]);

  const handleEditButtonClick = (task: any) => {
    setEditingTaskId(task.id);
    setEditingTask({
      taskName: task.taskName,
      subject: task.subject,
      date: task.date,
      beginningTime: task.beginningTime,
      finishedTime: task.finishedTime,
    });
  };

  const handleSaveButtonClick = (id: number) => {
    dispatch(editTask({ id, ...editingTask }));
    setEditingTaskId(null);
  };

  const handleDeleteButtonClick = (id: number) => {
    dispatch(deleteTask(id));
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setEditingTask({ ...editingTask, date: selectedDate.toISOString().split('T')[0] });
    }
  };

  const handleTimeChange = (field: string) => (event: any, selectedTime: Date | undefined) => {
    setShowTimePicker({ ...showTimePicker, [field]: false });
    if (selectedTime) {
      const timeString = selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setEditingTask({ ...editingTask, [field]: timeString });
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/image4.png')}
        style={styles.imageBackgroundTop}
      >
        <Text style={styles.heading}>Tasks</Text>
      </ImageBackground>

      <ScrollView contentContainerStyle={styles.middleContent}>
        {tasks.map(task => (
          <View key={task.id} style={styles.taskContainer}>
            {editingTaskId === task.id ? (
              <>
                <TextInput
                  style={styles.input}
                  value={editingTask.taskName}
                  onChangeText={(text) => setEditingTask({ ...editingTask, taskName: text })}
                />
                <TextInput
                  style={styles.input}
                  value={editingTask.subject}
                  onChangeText={(text) => setEditingTask({ ...editingTask, subject: text })}
                />
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <TextInput
                    style={styles.input}
                    value={editingTask.date}
                    placeholder="Select Date"
                    editable={false}
                  />
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={new Date(editingTask.date || Date.now())}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
                <TouchableOpacity onPress={() => setShowTimePicker({ ...showTimePicker, beginningTime: true })}>
                  <TextInput
                    style={styles.input}
                    value={editingTask.beginningTime}
                    placeholder="Select Beginning Time"
                    editable={false}
                  />
                </TouchableOpacity>
                {showTimePicker.beginningTime && (
                  <DateTimePicker
                    value={new Date()}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange('beginningTime')}
                  />
                )}
                <TouchableOpacity onPress={() => setShowTimePicker({ ...showTimePicker, finishedTime: true })}>
                  <TextInput
                    style={styles.input}
                    value={editingTask.finishedTime}
                    placeholder="Select Finished Time"
                    editable={false}
                  />
                </TouchableOpacity>
                {showTimePicker.finishedTime && (
                  <DateTimePicker
                    value={new Date()}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange('finishedTime')}
                  />
                )}
                <Button title="Save" onPress={() => handleSaveButtonClick(task.id)} />
              </>
            ) : (
              <>
                <View style={styles.taskDetail}>
                  <Text style={styles.textname}>{task.taskName}</Text>
                </View>
                <View style={styles.taskDetail}>
                  <Text style={styles.text}>{task.subject}</Text>
                </View>
                <View style={styles.taskDetail}>
                  <Text style={styles.text}>{task.date}</Text>
                </View>
                <View style={styles.taskDetailRow}>
                  <FontAwesomeIcon icon={faRegularClock} size={30} color="#734BF9" style={styles.icon} />
                  <View style={[styles.taskDetailColumn, { width: '50%' }]}>
                    <Text style={styles.text}>{task.beginningTime} TO {task.finishedTime}</Text>
                  </View>
                  <View style={[styles.taskDetailColumn, { backgroundColor: task.finishedTime ? 'lightgreen' : task.beginningTime ? 'orange' : 'transparent', borderRadius: 20 }]}>
                    <Text style={[styles.textone, { color: task.finishedTime ? 'green' : task.beginningTime ? 'red' : 'orange' }]}>
                      {task.finishedTime ? 'Done' : task.beginningTime ? 'Processing' : ''}
                    </Text>
                  </View>
                </View>
                <View style={styles.DEbtn}>
                  <Button color={"#E05638"} title="Delete" onPress={() => handleDeleteButtonClick(task.id)} />
                  <Button color={"#2F73E3"} title="Edit" onPress={() => handleEditButtonClick(task)} />
                </View>
              </>
            )}
          </View>
        ))}
      </ScrollView>
      <ImageBackground
        source={require('../assets/image4.png')}
        style={[styles.imageBackgroundBottom, { zIndex: -1 }]}
      >
        <View style={styles.btn}>
          <Button title="Add Task" color="#734BF9" onPress={() => navigation.goBack()} />
        </View>
      </ImageBackground>
    </View>
  );
};

export const taskCountSelector = (state: RootState) => state.tasks.tasks.length;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D3D3D3',
  },
  imageBackgroundTop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 300,
  },
  imageBackgroundBottom: {
    flex: 1,
    transform: [{ rotate: '180deg' }],
    width: 300,
    height: 300,
    marginLeft: 100,
  },
  heading: {
    fontSize: 40,
    fontWeight: '500',
    marginRight: 100,
  },
  middleContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  taskContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    width: '90%',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  taskDetail: {
    marginBottom: 3,
  },
  text: {
    fontSize: 18,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  btn: {
    width: 345,
    transform: [{ rotate: '180deg' }],
    position: 'absolute',
    margin: 10,
    marginLeft: 30,
  },
  DEbtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  textname: {
    fontSize: 25,
    fontWeight: '800',
  },
  taskDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -45,
  },
  taskDetailColumn: {
    flex: 1,
    padding: 5,
    alignItems: 'center',
  },
  textone: {
    fontSize: 16,
  },
  icon: {
    marginLeft: 45,
  },
});

export default Last;
