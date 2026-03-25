import { usersData, allCategories, allPermissions } from "../data/users";

let users = JSON.parse(JSON.stringify(usersData)); // deep copy for in-session edits

export const getUsers = async () => {
  return [...users];
};

export const getUserById = async (id) => {
  return JSON.parse(JSON.stringify(users.find((u) => u.id === Number(id)) || null));
};

export const updateUser = async (id, updatedData) => {
  users = users.map((u) => (u.id === Number(id) ? { ...u, ...updatedData } : u));
  return JSON.parse(JSON.stringify(users.find((u) => u.id === Number(id))));
};

export const updateUserSection = async (id, section, data) => {
  const user = users.find((u) => u.id === Number(id));
  if (!user) return null;
  Object.assign(user, data);
  return JSON.parse(JSON.stringify(user));
};

export const updateTaskStatus = async (userId, taskId, newStatus) => {
  const user = users.find((u) => u.id === Number(userId));
  if (!user) return null;
  const task = user.tasks.find((t) => t.id === taskId);
  if (task) task.status = newStatus;
  return JSON.parse(JSON.stringify(user));
};

export const assignTask = async (userId, taskTitle) => {
  const user = users.find((u) => u.id === Number(userId));
  if (!user) return null;
  const newId = user.tasks.length > 0 ? Math.max(...user.tasks.map((t) => t.id)) + 1 : 1;
  user.tasks.push({ id: newId, title: taskTitle, status: "pending" });
  return JSON.parse(JSON.stringify(user));
};

export const getCategories = async () => {
  return allCategories;
};

export const getPermissions = async () => {
  return allPermissions;
};
