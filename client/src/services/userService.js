import { usersData, allCategories, allPermissions } from "../data/users";

let users = [...usersData]; // mutable copy for in-session edits

export const getUsers = async () => {
  // Replace with: const res = await fetch('/api/users'); return res.json();
  return [...users];
};

export const getUserById = async (id) => {
  // Replace with: const res = await fetch(`/api/users/${id}`); return res.json();
  return users.find((u) => u.id === Number(id)) || null;
};

export const updateUser = async (id, updatedData) => {
  // Replace with: const res = await fetch(`/api/users/${id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(updatedData) }); return res.json();
  users = users.map((u) => (u.id === Number(id) ? { ...u, ...updatedData } : u));
  return users.find((u) => u.id === Number(id));
};

export const getCategories = async () => {
  // Replace with: const res = await fetch('/api/categories'); return res.json();
  return allCategories;
};

export const getPermissions = async () => {
  // Replace with: const res = await fetch('/api/permissions'); return res.json();
  return allPermissions;
};
