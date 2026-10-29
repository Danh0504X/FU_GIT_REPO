import type { SQLiteDatabase } from "expo-sqlite";

import type { Task, TaskData } from "../types/task";

// SQLite không có kiểu boolean, nên completed được lưu dạng 0/1
type TaskRow = {
  id: string;
  title: string;
  content: string;
  date: string;
  type: string;
  completed: number;
};

// Chạy 1 lần khi mở app (gọi từ SQLiteProvider onInit): tạo bảng nếu chưa có
export async function initDatabase(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      date TEXT NOT NULL DEFAULT '',
      type TEXT NOT NULL DEFAULT '',
      completed INTEGER NOT NULL DEFAULT 0
    );
  `);
}

export async function getTasks(db: SQLiteDatabase): Promise<Task[]> {
  const rows = await db.getAllAsync<TaskRow>(
    "SELECT * FROM tasks ORDER BY id ASC"
  );

  return rows.map((row) => ({
    ...row,
    completed: row.completed === 1,
  }));
}

export async function addTask(db: SQLiteDatabase, taskData: TaskData) {
  const id = Date.now().toString();

  await db.runAsync(
    "INSERT INTO tasks (id, title, content, date, type, completed) VALUES (?, ?, ?, ?, ?, 0)",
    id,
    taskData.title,
    taskData.content,
    taskData.date,
    taskData.type
  );
}

export async function toggleTask(db: SQLiteDatabase, id: string) {
  await db.runAsync(
    "UPDATE tasks SET completed = 1 - completed WHERE id = ?",
    id
  );
}

export async function deleteTask(db: SQLiteDatabase, id: string) {
  await db.runAsync("DELETE FROM tasks WHERE id = ?", id);
}
