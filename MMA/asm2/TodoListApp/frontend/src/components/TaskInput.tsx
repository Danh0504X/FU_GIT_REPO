import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

type TaskData = {
  title: string;
  content: string;
  date: string;
  type: string;
};

type Props = {
  onAddTask: (task: TaskData) => void;
};

export default function TaskInput({ onAddTask }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("");

  const handleAddTask = () => {
    if (title.trim() === "") {
      return;
    }

    const newTask = {
      title,
      content,
      date,
      type,
    };

    onAddTask(newTask);

    setTitle("");
    setContent("");
    setDate("");
    setType("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title:</Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập tiêu đề"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Content:</Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập nội dung"
        value={content}
        onChangeText={setContent}
      />

      <Text style={styles.label}>Date:</Text>

      <TextInput
        style={styles.input}
        placeholder="VD: 28/02/2026"
        value={date}
        onChangeText={setDate}
      />

      <Text style={styles.label}>Type:</Text>

      <TextInput
        style={styles.input}
        placeholder="VD: Dễ"
        value={type}
        onChangeText={setType}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddTask}
      >
        <Text style={styles.addButtonText}>ADD</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },

  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#aaaaaa",
    paddingVertical: 8,
    fontSize: 16,
  },

  addButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 13,
    borderRadius: 5,
    marginTop: 15,
    alignItems: "center",
  },

  addButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});