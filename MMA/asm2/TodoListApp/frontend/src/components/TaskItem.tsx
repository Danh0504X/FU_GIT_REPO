import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

type Task = {
  id: string;
  title: string;
  content: string;
  date: string;
  type: string;
  completed: boolean;
};

type Props = {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function TaskItem({
  task,
  onToggleComplete,
  onDelete,
}: Props) {
  return (
    <View style={styles.container}>

      <TouchableOpacity
        style={[
          styles.checkbox,
          task.completed && styles.checkboxCompleted,
        ]}
        onPress={() => onToggleComplete(task.id)}
      >
        {task.completed && (
          <Text style={styles.checkText}>✓</Text>
        )}
      </TouchableOpacity>


      <View style={styles.taskInfo}>
        <Text
          style={[
            styles.title,
            task.completed && styles.completedTitle,
          ]}
        >
          {task.title}
        </Text>

        <Text style={styles.content}>
          {task.content}
        </Text>

        <Text style={styles.type}>
          {task.type}
        </Text>
      </View>

  
      <View style={styles.rightSection}>

        <View style={styles.actions}>
          <TouchableOpacity>
            <Text style={styles.edit}>✏️</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onDelete(task.id)}
          >
            <Text style={styles.delete}>❌</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.date}>
          {task.date}
        </Text>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F8B5",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#777777",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxCompleted: {
    backgroundColor: "#222222",
  },

  checkText: {
    color: "#ffffff",
    fontWeight: "bold",
  },

  taskInfo: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
  },

  completedTitle: {
    textDecorationLine: "line-through",
    color: "#666666",
  },

  content: {
    fontSize: 14,
    marginTop: 3,
    color: "#555555",
  },

  type: {
    fontSize: 13,
    marginTop: 3,
    fontStyle: "italic",
  },

  rightSection: {
    alignItems: "flex-end",
  },

  actions: {
    flexDirection: "row",
    gap: 10,
  },

  edit: {
    fontSize: 18,
  },

  delete: {
    fontSize: 17,
  },

  date: {
    marginTop: 10,
    fontStyle: "italic",
    fontSize: 13,
  },
});