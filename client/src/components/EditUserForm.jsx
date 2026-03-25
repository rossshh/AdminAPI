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

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2.5,
    bgcolor: "rgba(15, 23, 42, 0.5)",
    border: "1px solid rgba(148,163,184,0.1)",
    "&:hover": { border: "1px solid rgba(129,140,248,0.3)" },
    "&.Mui-focused": { border: "1px solid #818cf8" },
    "& fieldset": { border: "none" },
  },
  "& .MuiInputLabel-root": { color: "text.secondary" },
};

const EditUserForm = ({ user, setUser, onCancel, section = "all" }) => {
  const [formData, setFormData] = useState(user);
  const [categories, setCategories] = useState([]);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    getCategories().then(setCategories);
    getPermissions().then(setPermissions);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePermissionsChange = (e) => {
    setFormData({ ...formData, permissions: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser(formData);
  };

  const showField = (fields) => section === "all" || fields.includes(section);

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 2,
        }}
      >
        {showField(["basic"]) && (
          <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} sx={inputSx} />
        )}
        {showField(["basic"]) && (
          <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} sx={inputSx} />
        )}
        {showField(["basic"]) && (
          <TextField fullWidth label="Phone" name="phone" value={formData.phone} onChange={handleChange} sx={inputSx} />
        )}
        {showField(["work"]) && (
          <TextField fullWidth select label="Category" name="category" value={formData.category} onChange={handleChange} sx={inputSx}>
            {categories.map((c) => (<MenuItem key={c} value={c}>{c}</MenuItem>))}
          </TextField>
        )}
        {showField(["work"]) && (
          <TextField fullWidth label="Department" name="department" value={formData.department || ""} onChange={handleChange} sx={inputSx} />
        )}
        {showField(["work"]) && (
          <TextField fullWidth label="Designation" name="designation" value={formData.designation || ""} onChange={handleChange} sx={inputSx} />
        )}
        {showField(["work"]) && (
          <TextField fullWidth label="Location" name="location" value={formData.location || ""} onChange={handleChange} sx={inputSx} />
        )}
      </Box>

      {showField(["permissions"]) && (
        <FormControl fullWidth sx={{ mt: 2, ...inputSx }}>
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
                  <Chip key={v} label={v} size="small"
                    sx={{ bgcolor: "rgba(129,140,248,0.15)", color: "#a5b4fc", fontWeight: 500, fontSize: 12 }}
                  />
                ))}
              </Box>
            )}
          >
            {permissions.map((p) => (
              <MenuItem key={p} value={p} sx={{ fontWeight: formData.permissions.includes(p) ? 600 : 400 }}>
                {p}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {showField(["aboutMe"]) && (
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="About Me"
            name="aboutMe"
            value={formData.aboutMe || ""}
            onChange={handleChange}
            multiline
            rows={3}
            sx={inputSx}
          />
        </Box>
      )}

      {showField(["skills"]) && (
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Skills (comma separated)"
            value={(formData.skills || []).join(", ")}
            onChange={(e) =>
              setFormData({
                ...formData,
                skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
              })
            }
            sx={inputSx}
          />
        </Box>
      )}

      {showField(["interests"]) && (
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Interests (comma separated)"
            value={(formData.interests || []).join(", ")}
            onChange={(e) =>
              setFormData({
                ...formData,
                interests: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
              })
            }
            sx={inputSx}
          />
        </Box>
      )}

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
        {onCancel && (
          <Button variant="outlined" onClick={onCancel}
            sx={{
              borderColor: "rgba(148,163,184,0.2)", color: "text.secondary",
              textTransform: "none", fontWeight: 600, borderRadius: 2, px: 3,
              "&:hover": { borderColor: "rgba(148,163,184,0.4)", bgcolor: "rgba(148,163,184,0.05)" },
            }}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" variant="contained"
          sx={{
            background: "linear-gradient(135deg, #818cf8, #6366f1)",
            textTransform: "none", fontWeight: 600, borderRadius: 2, px: 3,
            boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              boxShadow: "0 6px 20px rgba(99,102,241,0.4)",
            },
          }}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default EditUserForm;
