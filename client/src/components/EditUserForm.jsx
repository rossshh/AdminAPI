import {
  TextField,
  Button,
  Box,
  MenuItem,
  Chip,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
} from "@mui/material";
import { useState, useEffect } from "react";
import { getCategories, getPermissions } from "../services/userService";

const EditUserForm = ({ user, setUser, onCancel }) => {
  const [formData, setFormData] = useState(user);
  const [categories, setCategories] = useState([]);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    getCategories().then(setCategories);
    getPermissions().then(setPermissions);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePermissionsChange = (e) => {
    setFormData({
      ...formData,
      permissions: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setUser(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 2,
        }}
      >
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          select
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          {categories.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          label="Tasks Pending"
          name="tasksPending"
          type="number"
          value={formData.tasksPending}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Tasks Completed"
          name="tasksCompleted"
          type="number"
          value={formData.tasksCompleted}
          onChange={handleChange}
        />
      </Box>

      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Permissions</InputLabel>
        <Select
          multiple
          name="permissions"
          value={formData.permissions}
          onChange={handlePermissionsChange}
          input={<OutlinedInput label="Permissions" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((v) => (
                <Chip key={v} label={v} size="small" />
              ))}
            </Box>
          )}
        >
          {permissions.map((p) => (
            <MenuItem
              key={p}
              value={p}
              sx={{ fontWeight: formData.permissions.includes(p) ? 600 : 400 }}
            >
              {p}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box className="mt-3 flex justify-end gap-1">
        {onCancel && (
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="contained">
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default EditUserForm;
