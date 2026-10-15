import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";

import TaskInput from "../components/TaskInput";
import TaskItem from "../components/TaskItem";

type Task = {
  id: string;
  title: string;
  content: string;
  date: string;
  type: string;
  completed: boolean;
};

type TaskData = {
  title: string;
  content: string;
  date: string;
  type: string;
};

export default function HomeScreen() {

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Học Java",
      content: "Học Java cơ bản",
      date: "27/02/2023",
      type: "Dễ",
      completed: true,
    },

    {
      id: "2",
      title: "Học React Native",
      content: "Học component và state",
      date: "24/03/2023",
      type: "Trung bình",
      completed: false,
    },
  ]);


  const addTask = (taskData: TaskData) => {

    const newTask: Task = {
      id: Date.now().toString(),

      title: taskData.title,
      content: taskData.content,
      date: taskData.date,
      type: taskData.type,

      completed: false,
    };

    setTasks((currentTasks) => [
      ...currentTasks,
      newTask,
    ]);
  };


  const toggleComplete = (id: string) => {

    setTasks((currentTasks) =>
      currentTasks.map((task) => {

        if (task.id === id) {
          return {
            ...task,
            completed: !task.completed,
          };
        }

        return task;
      })
    );
  };

  
  const deleteTask = (id: string) => {

    setTasks((currentTasks) =>
      currentTasks.filter(
        (task) => task.id !== id
      )
    );
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        TODOLIST
      </Text>

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

  title: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },

});