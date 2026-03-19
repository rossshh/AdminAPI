export const usersData = [
  { id: 1, name: "Roshan", email: "roshan@gmail.com", role: "Admin", phone: "+91 98765 43210", status: "Active", category: "Management", permissions: ["Read", "Write", "Delete", "Manage Users"], tasksPending: 2, tasksCompleted: 5 },
  { id: 2, name: "Amit", email: "amit@gmail.com", role: "User", phone: "+91 87654 32109", status: "Active", category: "Sales", permissions: ["Read"], tasksPending: 3, tasksCompleted: 1 },
  { id: 3, name: "Priya", email: "priya@gmail.com", role: "User", phone: "+91 76543 21098", status: "Inactive", category: "Marketing", permissions: ["Read", "Write"], tasksPending: 0, tasksCompleted: 2 },
  { id: 4, name: "Sneha", email: "sneha@gmail.com", role: "Editor", phone: "+91 65432 10987", status: "Active", category: "Content", permissions: ["Read", "Write"], tasksPending: 2, tasksCompleted: 4 },
  { id: 5, name: "Rahul", email: "rahul@gmail.com", role: "User", phone: "+91 54321 09876", status: "Active", category: "Engineering", permissions: ["Read", "Write", "Delete"], tasksPending: 3, tasksCompleted: 2 },
  { id: 6, name: "Kavita", email: "kavita@gmail.com", role: "Moderator", phone: "+91 43210 98765", status: "Inactive", category: "Support", permissions: ["Read", "Write"], tasksPending: 1, tasksCompleted: 3 },
];

export const allCategories = ["Management", "Sales", "Marketing", "Content", "Engineering", "Support", "HR", "Finance"];
export const allPermissions = ["Read", "Write", "Delete", "Manage Users", "Manage Roles", "View Reports"];
