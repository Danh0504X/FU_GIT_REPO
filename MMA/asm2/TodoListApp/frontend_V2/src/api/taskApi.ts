import type { Task, TaskData } from "../types/task";
import { apiRequest } from "./apiClient";

// Mọi request đều tự gửi kèm token (apiClient), server chỉ trả task của user đang đăng nhập

export async function getTasks() {
  const data = await apiRequest<{ tasks: Task[] }>("/tasks");
  return data.tasks;
}

export async function createTask(taskData: TaskData) {
  const data = await apiRequest<{ task: Task }>("/tasks", {
    method: "POST",
    body: taskData,
  });
  return data.task;
}

export async function toggleTask(id: string) {
  const data = await apiRequest<{ task: Task }>(`/tasks/${id}/toggle`, {
    method: "PATCH",
  });
  return data.task;
}

export async function deleteTask(id: string) {
  await apiRequest<void>(`/tasks/${id}`, { method: "DELETE" });
}
