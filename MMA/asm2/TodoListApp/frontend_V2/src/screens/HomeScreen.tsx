import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";

import TaskInput from "../components/TaskInput";
import TaskItem from "../components/TaskItem";
import * as taskApi from "../api/taskApi";
import { ApiError } from "../api/apiClient";
import { useAuth } from "../context/AuthContext";
import type { Task, TaskData } from "../types/task";

function showError(error: unknown) {
  // 401 đã được AuthContext xử lý (tự đăng xuất + thông báo)
  if (error instanceof ApiError && error.status === 401) {
    return;
  }
  Alert.alert("Lỗi", error instanceof Error ? error.message : "Đã có lỗi xảy ra.");
}

export default function HomeScreen() {
  const { user, logout } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Kéo danh sách xuống để tải lại từ server
  const refreshTasks = useCallback(async () => {
    setIsRefreshing(true);
    try {
      setTasks(await taskApi.getTasks());
    } catch (error) {
      showError(error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Lần đầu vào màn hình: lấy danh sách task của user từ server
  useEffect(() => {
    taskApi
      .getTasks()
      .then(setTasks)
      .catch(showError)
      .finally(() => setIsLoading(false));
  }, []);


  // Server trả về task sau khi thay đổi nên chỉ cần cập nhật đúng task đó trong state
  const addTask = async (taskData: TaskData) => {
    try {
      const newTask = await taskApi.createTask(taskData);
      setTasks((currentTasks) => [...currentTasks, newTask]);
    } catch (error) {
      showError(error);
    }
  };


  const toggleComplete = async (id: string) => {
    try {
      const updatedTask = await taskApi.toggleTask(id);
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === id ? updatedTask : task
        )
      );
    } catch (error) {
      showError(error);
    }
  };


  const deleteTask = async (id: string) => {
    try {
      await taskApi.deleteTask(id);
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== id)
      );
    } catch (error) {
      showError(error);
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            TODOLIST
          </Text>

          {user && (
            <Text style={styles.username}>
              Xin chào, {user.username}
            </Text>
          )}
        </View>

        {/* Stack.Protected tự chuyển về Login khi đăng xuất xong */}
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      <TaskInput
        onAddTask={addTask}
      />

      {isLoading ? (
        <ActivityIndicator size="large" style={styles.loading} />
      ) : (
        <FlatList
          data={tasks}

          keyExtractor={(item) =>
            item.id
          }

          refreshing={isRefreshing}
          onRefresh={refreshTasks}

          ListEmptyComponent={
            <Text style={styles.empty}>
              Chưa có task nào
            </Text>
          }

          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onToggleComplete={toggleComplete}
              onDelete={deleteTask}
            />
          )}
        />
      )}

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

  username: {
    color: "#555555",
    marginTop: 2,
  },

  logout: {
    color: "#E53935",
    fontWeight: "bold",
  },

  loading: {
    marginTop: 30,
  },

  empty: {
    textAlign: "center",
    color: "#888888",
    marginTop: 20,
  },

});
