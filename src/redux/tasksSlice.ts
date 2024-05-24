
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Task {
  id: number;
  taskName: string;
  subject: string;
  date: string;
  beginningTime?: string;
  finishedTime?: string;
}

interface TasksState {
  tasks: Task[];
}

const initialState: TasksState = {
  tasks: [],
};

const TASKS_KEY = 'tasks';

const saveTasksToStorage = async (tasks: Task[]) => {
  try {
    const jsonValue = JSON.stringify(tasks);
    await AsyncStorage.setItem(TASKS_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save tasks', e);
  }
};

const loadTasksFromStorage = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(TASKS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to load tasks', e);
    return [];
  }
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
      saveTasksToStorage(state.tasks);
    },
    editTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
        saveTasksToStorage(state.tasks);
      }
    },
    deleteTask: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      saveTasksToStorage(state.tasks);
    },
    resetTasks: (state) => {
      state.tasks = [];
      saveTasksToStorage(state.tasks);
    },
  },
});

export const { setTasks, addTask, editTask, resetTasks, deleteTask } = tasksSlice.actions;

export const initializeTasks = () => async (dispatch: any) => {
  const tasks = await loadTasksFromStorage();
  dispatch(setTasks(tasks));
};

export default tasksSlice.reducer;
