import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

import TaskInput from "../components/TaskInput";
import TaskItem from "../components/TaskItem";
import * as taskRepository from "../database/taskRepository";
import { clearCredentials } from "../storage/authStorage";
import type { Task, TaskData } from "../types/task";

export default function HomeScreen() {
  const db = useSQLiteContext();

  const [tasks, setTasks] = useState<Task[]>([]);

  // Đọc lại danh sách từ SQLite sau mỗi thay đổi để state luôn khớp với database
  const loadTasks = useCallback(async () => {
    setTasks(await taskRepository.getTasks(db));
  }, [db]);

  // Lần đầu vào màn hình: lấy danh sách task đã lưu trong SQLite
  useEffect(() => {
    taskRepository.getTasks(db).then(setTasks);
  }, [db]);


  const addTask = async (taskData: TaskData) => {
    await taskRepository.addTask(db, taskData);
    await loadTasks();
  };


  const toggleComplete = async (id: string) => {
    await taskRepository.toggleTask(db, id);
    await loadTasks();
  };


  const deleteTask = async (id: string) => {
    await taskRepository.deleteTask(db, id);
    await loadTasks();
  };


  const logout = async () => {
    await clearCredentials();
    router.replace("/login");
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>
          TODOLIST
        </Text>

        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      <TaskInput
        onAddTask={addTask}
      />

      <FlatList
        data={tasks}

        keyExtractor={(item) =>
          item.id
        }

        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggleComplete={toggleComplete}
            onDelete={deleteTask}
          />
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: "#ffffff",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  title: {
    fontSize: 25,
    fontWeight: "bold",
  },

  logout: {
    color: "#E53935",
    fontWeight: "bold",
  },

});
