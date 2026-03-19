import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserById, updateUser } from "../services/userService";
import EditUserForm from "./EditUserForm";
import {
  Box, Typography, Avatar, Card, CardContent, IconButton, Chip,
  AppBar, Toolbar, Snackbar, Alert, Button, Dialog, DialogTitle,
  DialogContent, Divider, LinearProgress, Grid,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon, Edit as EditIcon, Close as CloseIcon,
} from "@mui/icons-material";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    getUserById(id).then((data) => {
      setUserData(data);
      setLoading(false);
    });
  }, [id]);

  const handleSave = async (updatedData) => {
    const saved = await updateUser(id, updatedData);
    setUserData(saved);
    setModalOpen(false);
    alert("User updated successfully!");
  };

  if (loading) return <Box className="p-4 text-center"><Typography>Loading...</Typography></Box>;

  const totalTasks = userData.tasksPending + userData.tasksCompleted;

  return (
    <Box className="min-h-screen bg-gray-50">
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" onClick={() => navigate("/")}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">User Profile</Typography>
        </Toolbar>
      </AppBar>

      <Box className="m-20">
        <Card sx={{ mb: 3 }}>
          <CardContent className="flex align-center justify-between flex-wrap gap-2">
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ width: 64, height: 64, bgcolor: "#1976d2", fontSize: 24 }}>
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={600}>{userData.name}</Typography>
                <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                  <Chip label={userData.category} size="small" variant="outlined" />
                </Box>
              </Box>
            </Box>
            <Button variant="contained" startIcon={<EditIcon />} onClick={() => setModalOpen(true)}>
              Edit
            </Button>
          </CardContent>
        </Card>

        <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>Details</Typography>
              {[
                { label: "Name", value: userData.name },
                { label: "Email", value: userData.email },
                { label: "Phone", value: userData.phone },
                { label: "Category", value: userData.category },
              ].map(({ label, value }) => (
                <Box key={label} className="flex items-center justify-between py-2 border-b border-gray-200">
                  <Typography variant="h5" color="text.secondary">{label}</Typography>
                  <Typography variant="h5" fontWeight={500}>{value}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Permissions</Typography>
              <Box className="flex flex-wrap gap-1 mb-3">
                {userData.permissions.map((perm) => (
                  <Chip key={perm} label={perm} color="primary" variant="outlined" size="medium" />
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>Tasks</Typography>
              <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Box className="p-3 mr-10 ml-10 bg-orange-100 rounded-lg">
                  <Typography variant="h5" fontWeight={600} color="primary">{userData.tasksPending}</Typography>
                  <Typography variant="caption">Pending</Typography>
                </Box>
                <Box className="p-3 mr-10 ml-10 bg-green-100 rounded-lg">
                  <Typography variant="h5" fontWeight={600} color="info">{userData.tasksCompleted}</Typography>
                  <Typography variant="caption">Completed</Typography>
                </Box>
                <Box className="p-3 mr-10 ml-10 bg-blue-100 rounded-lg">
                  <Typography variant="h5" fontWeight={600} color="success">{totalTasks}</Typography>
                  <Typography variant="caption">Total</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Edit Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Edit User
          <IconButton onClick={() => setModalOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <EditUserForm user={userData} setUser={handleSave} onCancel={() => setModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default UserProfile;
