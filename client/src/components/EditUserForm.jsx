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
  Typography,
} from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import { getCategories, getPermissions } from "../services/userService";

const BLUE = "#2563eb";
const BLUE_LIGHT = "rgba(37,99,235,0.08)";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2.5,
    bgcolor: "rgba(37,99,235,0.02)",
    border: "1px solid rgba(37,99,235,0.12)",
    "&:hover": { border: "1px solid rgba(37,99,235,0.25)" },
    "&.Mui-focused": { border: `1px solid ${BLUE}` },
    "& fieldset": { border: "none" },
  },
  "& .MuiInputLabel-root": { color: "text.secondary" },
};

const errorInputSx = {
  ...inputSx,
  "& .MuiOutlinedInput-root": {
    ...inputSx["& .MuiOutlinedInput-root"],
    border: "1px solid #dc2626",
    "&:hover": { border: "1px solid #dc2626" },
    "&.Mui-focused": { border: "1px solid #dc2626" },
  },
};

// Validation rules
const validators = {
  name: (val) => {
    if (!val || !val.trim()) return "Name is required";
    if (val.trim().length < 2) return "Name must be at least 2 characters";
    if (val.trim().length > 50) return "Name must be under 50 characters";
    if (!/^[a-zA-Z\s.'-]+$/.test(val.trim())) return "Name can only contain letters, spaces, dots, hyphens and apostrophes";
    return "";
  },
  email: (val) => {
    if (!val || !val.trim()) return "Email is required";
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val.trim())) return "Please enter a valid email address";
    return "";
  },
  phone: (val) => {
    if (!val || !val.trim()) return "Phone is required";
    const digits = val.replace(/[\s\-+()]/g, "");
    if (!/^\d{10,13}$/.test(digits)) return "Phone must have 10-13 digits";
    return "";
  },
  department: (val) => {
    if (!val || !val.trim()) return "Department is required";
    if (val.trim().length < 2) return "Department must be at least 2 characters";
    return "";
  },
  designation: (val) => {
    if (!val || !val.trim()) return "Designation is required";
    if (val.trim().length < 2) return "Designation must be at least 2 characters";
    return "";
  },
  location: (val) => {
    if (!val || !val.trim()) return "Location is required";
    if (val.trim().length < 2) return "Location must be at least 2 characters";
    return "";
  },
  aboutMe: (val) => {
    if (val && val.length > 500) return "About Me must be under 500 characters";
    return "";
  },
  skills: (val) => {
    if (!val || val.length === 0) return "Add at least one skill";
    return "";
  },
  interests: (val) => {
    if (!val || val.length === 0) return "Add at least one interest";
    return "";
  },
  permissions: (val) => {
    if (!val || val.length === 0) return "Select at least one permission";
    return "";
  },
};

const EditUserForm = ({ user, setUser, onCancel, section = "all" }) => {
  const [formData, setFormData] = useState(user);
  const [categories, setCategories] = useState([]);
  const [permissionsList, setPermissionsList] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Store initial data for comparison
  const initialData = useMemo(() => JSON.stringify(user), [user]);
  const hasChanges = JSON.stringify(formData) !== initialData;

  useEffect(() => {
    getCategories().then(setCategories);
    getPermissions().then(setPermissionsList);
  }, []);

  const validateField = (name, value) => {
    if (validators[name]) return validators[name](value);
    return "";
  };

  const validateAll = () => {
    const newErrors = {};
    const fieldsToValidate = [];

    if (section === "all" || section === "basic") fieldsToValidate.push("name", "email", "phone");
    if (section === "all" || section === "work") fieldsToValidate.push("department", "designation", "location");
    if (section === "aboutMe") fieldsToValidate.push("aboutMe");
    if (section === "skills") fieldsToValidate.push("skills");
    if (section === "interests") fieldsToValidate.push("interests");
    if (section === "permissions") fieldsToValidate.push("permissions");

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setTouched((prev) => ({ ...prev, [name]: true }));
    // Live validation on touched fields
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handlePermissionsChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, permissions: value });
    setTouched((prev) => ({ ...prev, permissions: true }));
    const error = validateField("permissions", value);
    setErrors((prev) => ({ ...prev, permissions: error }));
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
    setFormData({ ...formData, skills });
    setTouched((prev) => ({ ...prev, skills: true }));
    const error = validateField("skills", skills);
    setErrors((prev) => ({ ...prev, skills: error }));
  };

  const handleInterestsChange = (e) => {
    const interests = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
    setFormData({ ...formData, interests });
    setTouched((prev) => ({ ...prev, interests: true }));
    const error = validateField("interests", interests);
    setErrors((prev) => ({ ...prev, interests: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hasChanges) return;
    if (!validateAll()) return;
    setUser(formData);
  };

  const showField = (fields) => section === "all" || fields.includes(section);

  const fieldError = (name) => touched[name] && errors[name];

  const getFieldSx = (name) => fieldError(name) ? errorInputSx : inputSx;

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 2,
        }}
      >
        {showField(["basic"]) && (
          <Box>
            <TextField fullWidth label="Name" name="name" value={formData.name}
              onChange={handleChange} onBlur={handleBlur} sx={getFieldSx("name")}
              error={!!fieldError("name")}
            />
            {fieldError("name") && (
              <Typography sx={{ fontSize: 12, color: "#dc2626", mt: 0.5, ml: 0.5 }}>{errors.name}</Typography>
            )}
          </Box>
        )}
        {showField(["basic"]) && (
          <Box>
            <TextField fullWidth label="Email" name="email" type="email" value={formData.email}
              onChange={handleChange} onBlur={handleBlur} sx={getFieldSx("email")}
              error={!!fieldError("email")}
            />
            {fieldError("email") && (
              <Typography sx={{ fontSize: 12, color: "#dc2626", mt: 0.5, ml: 0.5 }}>{errors.email}</Typography>
            )}
          </Box>
        )}
        {showField(["basic"]) && (
          <Box>
            <TextField fullWidth label="Phone" name="phone" value={formData.phone}
              onChange={handleChange} onBlur={handleBlur} sx={getFieldSx("phone")}
              error={!!fieldError("phone")}
            />
            {fieldError("phone") && (
              <Typography sx={{ fontSize: 12, color: "#dc2626", mt: 0.5, ml: 0.5 }}>{errors.phone}</Typography>
            )}
          </Box>
        )}
        {showField(["work"]) && (
          <TextField fullWidth select label="Category" name="category" value={formData.category} onChange={handleChange} sx={inputSx}>
            {categories.map((c) => (<MenuItem key={c} value={c}>{c}</MenuItem>))}
          </TextField>
        )}
        {showField(["work"]) && (
          <Box>
            <TextField fullWidth label="Department" name="department" value={formData.department || ""}
              onChange={handleChange} onBlur={handleBlur} sx={getFieldSx("department")}
              error={!!fieldError("department")}
            />
            {fieldError("department") && (
              <Typography sx={{ fontSize: 12, color: "#dc2626", mt: 0.5, ml: 0.5 }}>{errors.department}</Typography>
            )}
          </Box>
        )}
        {showField(["work"]) && (
          <Box>
            <TextField fullWidth label="Designation" name="designation" value={formData.designation || ""}
              onChange={handleChange} onBlur={handleBlur} sx={getFieldSx("designation")}
              error={!!fieldError("designation")}
            />
            {fieldError("designation") && (
              <Typography sx={{ fontSize: 12, color: "#dc2626", mt: 0.5, ml: 0.5 }}>{errors.designation}</Typography>
            )}
          </Box>
        )}
        {showField(["work"]) && (
          <Box>
            <TextField fullWidth label="Location" name="location" value={formData.location || ""}
              onChange={handleChange} onBlur={handleBlur} sx={getFieldSx("location")}
              error={!!fieldError("location")}
            />
            {fieldError("location") && (
              <Typography sx={{ fontSize: 12, color: "#dc2626", mt: 0.5, ml: 0.5 }}>{errors.location}</Typography>
            )}
          </Box>
        )}
      </Box>

      {showField(["permissions"]) && (
        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth sx={fieldError("permissions") ? errorInputSx : inputSx}
            error={!!fieldError("permissions")}
          >
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
                      sx={{ bgcolor: BLUE_LIGHT, color: BLUE, fontWeight: 500, fontSize: 12 }}
                    />
                  ))}
                </Box>
              )}
            >
              {permissionsList.map((p) => (
                <MenuItem key={p} value={p} sx={{ fontWeight: formData.permissions.includes(p) ? 600 : 400 }}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {fieldError("permissions") && (
            <Typography sx={{ fontSize: 12, color: "#dc2626", mt: 0.5, ml: 0.5 }}>{errors.permissions}</Typography>
          )}
        </Box>
      )}

      {showField(["aboutMe"]) && (
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="About Me"
            name="aboutMe"
            value={formData.aboutMe || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            multiline
            rows={3}
            sx={getFieldSx("aboutMe")}
            error={!!fieldError("aboutMe")}
            helperText={formData.aboutMe ? `${formData.aboutMe.length}/500` : ""}
          />
          {fieldError("aboutMe") && (
            <Typography sx={{ fontSize: 12, color: "#dc2626", mt: 0.5, ml: 0.5 }}>{errors.aboutMe}</Typography>
          )}
        </Box>
      )}

      {showField(["skills"]) && (
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Skills (comma separated)"
            value={(formData.skills || []).join(", ")}
            onChange={handleSkillsChange}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, skills: true }));
              setErrors((prev) => ({ ...prev, skills: validateField("skills", formData.skills) }));
            }}
            sx={getFieldSx("skills")}
            error={!!fieldError("skills")}
          />
          {fieldError("skills") && (
            <Typography sx={{ fontSize: 12, color: "#dc2626", mt: 0.5, ml: 0.5 }}>{errors.skills}</Typography>
          )}
        </Box>
      )}

      {showField(["interests"]) && (
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Interests (comma separated)"
            value={(formData.interests || []).join(", ")}
            onChange={handleInterestsChange}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, interests: true }));
              setErrors((prev) => ({ ...prev, interests: validateField("interests", formData.interests) }));
            }}
            sx={getFieldSx("interests")}
            error={!!fieldError("interests")}
          />
          {fieldError("interests") && (
            <Typography sx={{ fontSize: 12, color: "#dc2626", mt: 0.5, ml: 0.5 }}>{errors.interests}</Typography>
          )}
        </Box>
      )}

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
        {onCancel && (
          <Button variant="outlined" onClick={onCancel}
            sx={{
              borderColor: "rgba(37,99,235,0.2)", color: "text.secondary",
              textTransform: "none", fontWeight: 600, borderRadius: 2, px: 3,
              "&:hover": { borderColor: "rgba(37,99,235,0.4)", bgcolor: "rgba(37,99,235,0.04)" },
            }}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" variant="contained" disabled={!hasChanges}
          sx={{
            background: `linear-gradient(135deg, ${BLUE}, #1d4ed8)`,
            textTransform: "none", fontWeight: 600, borderRadius: 2, px: 3,
            boxShadow: "0 4px 14px rgba(37,99,235,0.25)",
            "&:hover": {
              background: "linear-gradient(135deg, #1d4ed8, #1e40af)",
              boxShadow: "0 6px 20px rgba(37,99,235,0.3)",
            },
            "&.Mui-disabled": {
              background: "rgba(37,99,235,0.15)",
              color: "rgba(37,99,235,0.4)",
              boxShadow: "none",
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
