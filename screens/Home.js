// Các import cần thiết
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { ActionSheetProvider, useActionSheet } from '@expo/react-native-action-sheet';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FadeInRight } from 'react-native-reanimated';

const Home = () => {
  const { showActionSheetWithOptions } = useActionSheet();
  const [task, setTask] = useState('');
  const [taskList, setTaskList] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const addTask = () => {
    if (task.trim()) {
      setTaskList([...taskList, {
        id: Date.now(),
        text: task,
        completed: false,
        dueDate: dueDate.toLocaleDateString(),
      }]);
      setTask('');
      setDueDate(new Date());
    } else {
      alert('Nội dung nhiệm vụ không được để trống.');
    }
  };

  const deleteTask = (id) => {
    Alert.alert(
      "Xóa nhiệm vụ",
      "Bạn có chắc chắn muốn xóa nhiệm vụ này?",
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        {
          text: "Xóa",
          onPress: () => setTaskList(taskList.filter(task => task.id !== id)),
          style: "destructive"
        }
      ]
    );
  };

  const completeTask = (id) => {
    setTaskList(taskList.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const editTask = (id, newText) => {
    if (newText.trim()) {
      setTaskList(taskList.map(task =>
        task.id === id ? { ...task, text: newText } : task
      ));
      setEditingTask(null);
    } else {
      alert('Nội dung nhiệm vụ không được để trống.');
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate;
    setShowDatePicker(false);
    setDueDate(currentDate);
  };

  const sortTasks = (sortType) => {
    let sortedTasks;
    switch (sortType) {
      case 'aToZ':
        sortedTasks = [...taskList].sort((a, b) => a.text.localeCompare(b.text));
        break;
      case 'createdAt':
        sortedTasks = [...taskList].sort((a, b) => a.id - b.id);
        break;
      default:
        return;
    }
    setTaskList(sortedTasks);
  };

  const showSortOptions = () => {
    const options = ['Hủy', 'Sắp xếp A-Z', 'Sắp xếp theo trình tự tạo'];
    const cancelButtonIndex = 0;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 1:
            sortTasks('aToZ');
            break;
          case 2:
            sortTasks('createdAt');
            break;
        }
      }
    );
  };

  const filteredTasks = taskList.filter(task => 
    task.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={[styles.taskContainer, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
      {editingTask?.id === item.id ? (
        <TextInput
          style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]}
          value={editingTask.text}
          onChangeText={(text) => setEditingTask({ ...editingTask, text })}
          onBlur={() => editTask(editingTask.id, editingTask.text)}
        />
      ) : (
        <>
          <View style={styles.taskInfo}>
            <Text style={[styles.taskText, { color: isDarkMode ? '#fff' : '#000' }, item.completed && styles.completedTask]}>
              {item.text}
            </Text>
            <Text style={[styles.dueDateText, { color: isDarkMode ? '#ccc' : '#000' }]}>Due: {item.dueDate}</Text>
          </View>
          <TouchableOpacity onPress={() => completeTask(item.id)} style={styles.button}>
            <Icon name={item.completed ? 'undo' : 'check'} size={24} color={item.completed ? 'orange' : 'green'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setEditingTask(item)} style={styles.button}>
            <Icon name="edit" size={24} color="blue" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.button}>
            <Icon name="delete" size={24} color="red" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  const logout = () => {
    // Thực hiện hành động đăng xuất (xóa thông tin người dùng, điều hướng về màn hình đăng nhập, v.v.)
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất không?", [
      {
        text: "Hủy",
        style: "cancel"
      },
      {
        text: "Đăng xuất",
        onPress: () => {
          // Thực hiện hành động đăng xuất, như xóa thông tin người dùng
          console.log("Đăng xuất thành công");
        }
      }
    ]);
  };

  return (
    
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#fff' }]}>
      

      <View style={styles.searchSortContainer}>
        <TextInput
          style={[styles.searchInput, { borderColor: isDarkMode ? '#fff' : '#000' }]}
          placeholder="Tìm kiếm nhiệm vụ"
          placeholderTextColor={isDarkMode ? '#ccc' : '#000'}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity onPress={showSortOptions} style={styles.sortButton}>
          <Icon name="sort" size={24} color="blue" />
        </TouchableOpacity>
      </View>

      <TextInput
        style={[styles.input, { color: isDarkMode ? '#fff' : '#000', borderColor: isDarkMode ? '#fff' : '#000' }]}
        placeholder="Nhiệm vụ mới"
        placeholderTextColor={isDarkMode ? '#ccc' : '#000'}
        value={task}
        onChangeText={setTask}
      />

      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
        <Text style={styles.buttonText}>Chọn ngày đến hạn</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <FlatList
        data={filteredTasks}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        style={styles.list}
      />

      <Button title="Thêm" onPress={addTask} />

      <View style={styles.toggleContainer}>
        <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
        <Text style={styles.buttonText}>Đăng xuất</Text>
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const App = () => {
  return (
    <ActionSheetProvider>
      <Home />
    </ActionSheetProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  list: {
    marginTop: 20,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  taskInfo: {
    flex: 1,
  },
  taskText: {
    fontSize: 18,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  dueDateText: {
    fontSize: 14,
  },
  button: {
    marginRight: 10,
  },
  datePickerButton: {
    backgroundColor: '#ccc',
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#000',
  },
  searchSortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sortButton: {
    marginLeft: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: 'gray',
    padding: 10,
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 5,
  },
});

export default App;
