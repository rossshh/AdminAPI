import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserById, updateUser, updateUserSection, updateTaskStatus, assignTask } from "../services/userService";
import EditUserForm from "./EditUserForm";
import TaskBoard from "./TaskBoard";
import {
  Box, Typography, Avatar, Card, CardContent, IconButton, Chip,
  Snackbar, Alert, Button, Dialog, DialogTitle, DialogContent, Divider,
  CircularProgress, TextField,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon, Edit as EditIcon, Close as CloseIcon,
  Email as EmailIcon, Phone as PhoneIcon, Person as PersonIcon,
  Category as CategoryIcon, Badge as BadgeIcon, Business as DeptIcon,
  LocationOn as LocIcon, CalendarMonth as CalendarIcon,
  Add as AddIcon,
} from "@mui/icons-material";

const BLUE = "#2563eb";
const BLUE_LIGHT = "rgba(37,99,235,0.08)";
const BLUE_BORDER = "rgba(37,99,235,0.2)";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editSection, setEditSection] = useState("all");
  const [editTitle, setEditTitle] = useState("Edit User");
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("User updated successfully!");

  // Assign task state
  const [assignOpen, setAssignOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    getUserById(id).then((data) => { setUserData(data); setLoading(false); });
  }, [id]);

  const handleSave = async (updatedData) => {
    const saved = await updateUser(id, updatedData);
    setUserData(saved);
    setModalOpen(false);
    setSnackMsg("User updated successfully!");
    setSnackOpen(true);
  };

  const openEdit = (section, title) => {
    setEditSection(section);
    setEditTitle(title);
    setModalOpen(true);
  };

  const handleTaskMove = async (taskId, newStatus) => {
    const saved = await updateTaskStatus(id, taskId, newStatus);
    setUserData(saved);
  };

  const handleAssignTask = async () => {
    if (!newTaskTitle.trim()) return;
    const saved = await assignTask(id, newTaskTitle.trim());
    setUserData(saved);
    setNewTaskTitle("");
    setAssignOpen(false);
    setSnackMsg("Task assigned successfully!");
    setSnackOpen(true);
  };

  if (loading)
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress sx={{ color: BLUE }} />
      </Box>
    );

  const pendingCount = userData.tasks.filter((t) => t.status === "pending").length;
  const completedCount = userData.tasks.filter((t) => t.status === "completed").length;

  const sectionEditBtn = (section, title) => (
    <IconButton
      size="small"
      onClick={() => openEdit(section, title)}
      sx={{
        color: "text.secondary", width: 30, height: 30,
        "&:hover": { color: BLUE, bgcolor: BLUE_LIGHT },
      }}
    >
      <EditIcon sx={{ fontSize: 16 }} />
    </IconButton>
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Header Bar */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)",
          borderBottom: "1px solid rgba(37,99,235,0.15)",
          px: { xs: 2, md: 4 }, py: 2,
        }}
      >
        <Box sx={{ px: { xs: 2, md: 6 }, display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={() => navigate("/")} sx={{ color: "rgba(255,255,255,0.8)", "&:hover": { color: "#fff" } }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#fff" }}>
            User Profile
          </Typography>
        </Box>
      </Box>

      <Box sx={{ px: { xs: 2, md: 6 }, py: 4 }}>
        {/* ═══ OVERVIEW PANEL ═══ */}
        <Card sx={{ mb: 3, overflow: "visible" }}>
          <Box
            sx={{
              height: 80,
              background: "linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)",
              borderRadius: "12px 12px 0 0",
            }}
          />
          <CardContent sx={{ pt: 0, px: 3, pb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mt: -4 }}>
              <Box sx={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
                <Avatar
                  sx={{
                    width: 72, height: 72,
                    background: "linear-gradient(135deg, #2563eb, #60a5fa)",
                    fontSize: 26, fontWeight: 700,
                    border: "3px solid", borderColor: "background.paper",
                    boxShadow: "0 4px 14px rgba(37,99,235,0.25)",
                  }}
                >
                  {userData.name.charAt(0)}
                </Avatar>
                <Box sx={{ mb: 0.5 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1.2 }}>
                    {userData.name}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.25 }}>
                    {userData.designation} • {userData.department}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, mt: 0.75 }}>
                    <Chip label={userData.category} size="small"
                      sx={{ bgcolor: BLUE_LIGHT, color: BLUE, fontWeight: 600, fontSize: 11 }} />
                    {userData.role && (
                      <Chip label={userData.role} size="small"
                        sx={{ bgcolor: "rgba(37,99,235,0.05)", color: "#3b82f6", fontWeight: 600, fontSize: 11 }} />
                    )}
                    <Chip label={userData.employeeId} size="small"
                      sx={{ bgcolor: "rgba(37,99,235,0.05)", color: BLUE, fontWeight: 600, fontSize: 11 }} />
                  </Box>
                </Box>
              </Box>

              {/* Overview quick stats */}
              <Box sx={{ display: "flex", gap: 2 }}>
                {[
                  { label: "Pending", val: pendingCount, color: "#ea580c" },
                  { label: "Done", val: completedCount, color: "#16a34a" },
                  { label: "Total", val: userData.tasks.length, color: BLUE },
                ].map((s) => (
                  <Box key={s.label} sx={{ textAlign: "center" }}>
                    <Typography sx={{ fontSize: 20, fontWeight: 700, color: s.color, lineHeight: 1 }}>
                      {s.val}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: "text.secondary", fontWeight: 500 }}>
                      {s.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Overview info row */}
            <Box
              sx={{
                display: "flex", flexWrap: "wrap", gap: 3, mt: 2.5, pt: 2,
                borderTop: "1px solid rgba(37,99,235,0.08)",
              }}
            >
              {[
                { icon: <EmailIcon sx={{ fontSize: 15 }} />, value: userData.email },
                { icon: <PhoneIcon sx={{ fontSize: 15 }} />, value: userData.phone },
                { icon: <LocIcon sx={{ fontSize: 15 }} />, value: userData.location },
                { icon: <CalendarIcon sx={{ fontSize: 15 }} />, value: `Joined ${new Date(userData.joiningDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}` },
              ].map((item, i) => (
                <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <Box sx={{ color: BLUE }}>{item.icon}</Box>
                  <Typography sx={{ fontSize: 13, color: "text.secondary" }}>{item.value}</Typography>
                </Box>
              ))}
            </Box>

            {/* About Me */}
            <Box sx={{ mt: 2.5, pt: 2, borderTop: "1px solid rgba(37,99,235,0.08)" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 14, color: "text.primary" }}>
                  About Me
                </Typography>
                {sectionEditBtn("aboutMe", "Edit About Me")}
              </Box>
              <Typography sx={{ fontSize: 13, color: "text.secondary", lineHeight: 1.6 }}>
                {userData.aboutMe || "No bio added yet."}
              </Typography>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3, mt: 2.5, pt: 2, borderTop: "1px solid rgba(37,99,235,0.08)" }}>
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 14, color: "text.primary" }}>
                    Skills
                  </Typography>
                  {sectionEditBtn("skills", "Edit Skills")}
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                  {(userData.skills || []).map((skill) => (
                    <Chip key={skill} label={skill} size="small"
                      sx={{
                        bgcolor: BLUE_LIGHT, color: BLUE,
                        border: `1px solid ${BLUE_BORDER}`,
                        fontWeight: 500, fontSize: 11,
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 14, color: "text.primary" }}>
                    Interests
                  </Typography>
                  {sectionEditBtn("interests", "Edit Interests")}
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                  {(userData.interests || []).map((interest) => (
                    <Chip key={interest} label={interest} size="small"
                      sx={{
                        bgcolor: "rgba(37,99,235,0.05)", color: "#3b82f6",
                        border: "1px solid rgba(37,99,235,0.12)",
                        fontWeight: 500, fontSize: 11,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* ═══ DETAIL CARDS GRID ═══ */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3, mb: 3 }}>
          {/* Basic Details */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 16, color: "text.primary" }}>
                  Basic Details
                </Typography>
                {sectionEditBtn("basic", "Edit Basic Details")}
              </Box>
              {[
                { icon: <PersonIcon sx={{ fontSize: 18 }} />, label: "Name", value: userData.name },
                { icon: <EmailIcon sx={{ fontSize: 18 }} />, label: "Email", value: userData.email },
                { icon: <PhoneIcon sx={{ fontSize: 18 }} />, label: "Phone", value: userData.phone },
              ].map(({ icon, label, value }) => (
                <Box key={label} sx={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  py: 1.5, borderBottom: "1px solid rgba(37,99,235,0.06)",
                  "&:last-child": { borderBottom: "none" },
                }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box sx={{ color: BLUE }}>{icon}</Box>
                    <Typography sx={{ fontSize: 14, color: "text.secondary" }}>{label}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 500, color: "text.primary" }}>{value}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* Work Info */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 16, color: "text.primary" }}>
                  Work Info
                </Typography>
                {sectionEditBtn("work", "Edit Work Info")}
              </Box>
              {[
                { icon: <CategoryIcon sx={{ fontSize: 18 }} />, label: "Category", value: userData.category },
                { icon: <DeptIcon sx={{ fontSize: 18 }} />, label: "Department", value: userData.department },
                { icon: <BadgeIcon sx={{ fontSize: 18 }} />, label: "Designation", value: userData.designation },
                { icon: <LocIcon sx={{ fontSize: 18 }} />, label: "Location", value: userData.location },
              ].map(({ icon, label, value }) => (
                <Box key={label} sx={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  py: 1.5, borderBottom: "1px solid rgba(37,99,235,0.06)",
                  "&:last-child": { borderBottom: "none" },
                }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box sx={{ color: BLUE }}>{icon}</Box>
                    <Typography sx={{ fontSize: 14, color: "text.secondary" }}>{label}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 500, color: "text.primary" }}>{value}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>

        {/* Permissions Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 16, color: "text.primary" }}>
                Permissions
              </Typography>
              {sectionEditBtn("permissions", "Edit Permissions")}
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {userData.permissions.map((perm) => (
                <Chip key={perm} label={perm} size="small"
                  onDelete={async () => {
                    const updated = { ...userData, permissions: userData.permissions.filter((p) => p !== perm) };
                    const saved = await updateUser(id, updated);
                    setUserData(saved);
                  }}
                  deleteIcon={<CloseIcon sx={{ fontSize: "14px !important", color: `${BLUE} !important`, "&:hover": { color: "#dc2626 !important" } }} />}
                  sx={{
                    bgcolor: BLUE_LIGHT, color: BLUE,
                    border: `1px solid ${BLUE_BORDER}`,
                    fontWeight: 500, fontSize: 12,
                  }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Tasks Kanban Board */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 16, color: "text.primary" }}>
                Tasks
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Typography sx={{ fontSize: 12, color: "text.secondary", fontStyle: "italic" }}>
                  Drag to move between columns
                </Typography>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => setAssignOpen(true)}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: 13,
                    color: "#fff",
                    bgcolor: BLUE,
                    borderRadius: 2,
                    px: 2,
                    "&:hover": { bgcolor: "#1d4ed8" },
                  }}
                >
                  Assign Task
                </Button>
              </Box>
            </Box>
            <TaskBoard tasks={userData.tasks} onTaskMove={handleTaskMove} />
          </CardContent>
        </Card>
      </Box>

      {/* Edit Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 700, fontSize: 18 }}>
          {editTitle}
          <IconButton onClick={() => setModalOpen(false)} sx={{ color: "text.secondary" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider sx={{ borderColor: "rgba(37,99,235,0.1)" }} />
        <DialogContent sx={{ pt: 3 }}>
          <EditUserForm user={userData} setUser={handleSave} onCancel={() => setModalOpen(false)} section={editSection} />
        </DialogContent>
      </Dialog>

      {/* Assign Task Modal */}
      <Dialog open={assignOpen} onClose={() => setAssignOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 700, fontSize: 18 }}>
          Assign New Task
          <IconButton onClick={() => setAssignOpen(false)} sx={{ color: "text.secondary" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider sx={{ borderColor: "rgba(37,99,235,0.1)" }} />
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            fullWidth
            label="Task Title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAssignTask(); }}
            placeholder="Enter task title..."
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2.5,
                border: "1px solid rgba(37,99,235,0.12)",
                "&:hover": { border: `1px solid ${BLUE_BORDER}` },
                "&.Mui-focused": { border: `1px solid ${BLUE}` },
                "& fieldset": { border: "none" },
              },
              "& .MuiInputLabel-root": { color: "text.secondary" },
            }}
          />
          <Typography sx={{ fontSize: 12, color: "text.secondary", mb: 2 }}>
            This task will be assigned with <strong>Pending</strong> status.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
            <Button onClick={() => setAssignOpen(false)}
              sx={{
                textTransform: "none", fontWeight: 600, borderRadius: 2, px: 3,
                color: "text.secondary", border: "1px solid rgba(37,99,235,0.15)",
                "&:hover": { bgcolor: "rgba(37,99,235,0.04)" },
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAssignTask}
              variant="contained"
              disabled={!newTaskTitle.trim()}
              sx={{
                textTransform: "none", fontWeight: 600, borderRadius: 2, px: 3,
                bgcolor: BLUE,
                boxShadow: "0 4px 14px rgba(37,99,235,0.25)",
                "&:hover": { bgcolor: "#1d4ed8", boxShadow: "0 6px 20px rgba(37,99,235,0.3)" },
                "&.Mui-disabled": { bgcolor: "rgba(37,99,235,0.3)", color: "rgba(255,255,255,0.6)" },
              }}
            >
              Assign Task
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackOpen} autoHideDuration={3000} onClose={() => setSnackOpen(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={() => setSnackOpen(false)} severity="success" sx={{ borderRadius: 2, fontWeight: 500 }}>
          {snackMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserProfile;
