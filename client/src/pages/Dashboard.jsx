import { useEffect, useState } from "react";
import { getUsers, getCategories } from "../services/userService";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  People as PeopleIcon,
  SortByAlpha as SortIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const BLUE = "#2563eb";
const BLUE_LIGHT = "rgba(37,99,235,0.08)";
const BLUE_BORDER = "rgba(37,99,235,0.25)";

const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("name-asc");

  useEffect(() => {
    getUsers().then(setUsers);
    getCategories().then(setCategories);
  }, []);

  const filtered = users
    .filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === "All" || u.category === categoryFilter;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name-asc": return a.name.localeCompare(b.name);
        case "name-desc": return b.name.localeCompare(a.name);
        case "tasks-most": return b.tasks.length - a.tasks.length;
        case "tasks-least": return a.tasks.length - b.tasks.length;
        default: return 0;
      }
    });

  const getInitials = (name) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase();

  const avatarColors = [
    "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
    "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
    "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)",
    "linear-gradient(135deg, #2563eb 0%, #6366f1 100%)",
    "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
    "linear-gradient(135deg, #3b82f6 0%, #818cf8 100%)",
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)",
          borderBottom: "1px solid rgba(37,99,235,0.15)",
          px: { xs: 2, md: 4 },
          py: 3,
        }}
      >
        <Box
          sx={{
            px: { xs: 2, md: 6 },
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 40, height: 40, borderRadius: 2,
                background: "rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <PeopleIcon sx={{ color: "#fff", fontSize: 22 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#fff", letterSpacing: -0.5 }}>
              Admin Panel
            </Typography>
          </Box>
          <Chip
            label={`${filtered.length} / ${users.length} Users`}
            sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 600, fontSize: 13 }}
          />
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ px: { xs: 2, md: 6 }, py: 4 }}>
        {/* Search + Sort row */}
        <Box sx={{ display: "flex", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
          <TextField
            fullWidth
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              flex: 1, minWidth: 200,
              "& .MuiOutlinedInput-root": {
                bgcolor: "background.paper", borderRadius: 3,
                border: "1px solid rgba(37,99,235,0.12)",
                "&:hover": { border: `1px solid ${BLUE_BORDER}` },
                "&.Mui-focused": { border: `1px solid ${BLUE}` },
                "& fieldset": { border: "none" },
              },
            }}
          />
          <FormControl
            sx={{
              minWidth: 160,
              "& .MuiOutlinedInput-root": {
                bgcolor: "background.paper", borderRadius: 3,
                border: "1px solid rgba(37,99,235,0.12)",
                "&:hover": { border: `1px solid ${BLUE_BORDER}` },
                "& fieldset": { border: "none" },
              },
            }}
          >
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              startAdornment={<SortIcon sx={{ color: "text.secondary", mr: 1 }} />}
              sx={{ fontSize: 14 }}
            >
              <MenuItem value="name-asc">Name A → Z</MenuItem>
              <MenuItem value="name-desc">Name Z → A</MenuItem>
              <MenuItem value="tasks-most">Most Tasks</MenuItem>
              <MenuItem value="tasks-least">Fewest Tasks</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Category Filter Chips */}
        <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
          {["All", ...categories].map((cat) => (
            <Chip
              key={cat}
              label={cat}
              size="small"
              onClick={() => setCategoryFilter(cat)}
              sx={{
                fontWeight: 600, fontSize: 12, cursor: "pointer",
                transition: "all 0.2s ease",
                bgcolor: categoryFilter === cat ? BLUE_LIGHT : "rgba(100,116,139,0.08)",
                color: categoryFilter === cat ? BLUE : "text.secondary",
                border: categoryFilter === cat ? `1px solid ${BLUE_BORDER}` : "1px solid transparent",
                "&:hover": {
                  bgcolor: BLUE_LIGHT,
                  color: BLUE,
                },
              }}
            />
          ))}
        </Box>

        {/* User List */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {filtered.map((user, idx) => {
            const pending = user.tasks.filter((t) => t.status === "pending").length;
            const completed = user.tasks.filter((t) => t.status === "completed").length;
            return (
              <Box
                key={user.id}
                onClick={() => navigate(`/user/${user.id}`)}
                sx={{
                  display: "flex", alignItems: "center", gap: 2, p: 2,
                  borderRadius: 3, bgcolor: "background.paper",
                  border: "1px solid rgba(37,99,235,0.08)",
                  cursor: "pointer", transition: "all 0.2s ease",
                  "&:hover": {
                    border: `1px solid ${BLUE_BORDER}`,
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 20px rgba(37,99,235,0.1)",
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 44, height: 44,
                    background: avatarColors[idx % avatarColors.length],
                    fontSize: 15, fontWeight: 700,
                  }}
                >
                  {getInitials(user.name)}
                </Avatar>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: 15, color: "text.primary" }}>
                    {user.name}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.25 }}>
                    {user.email}
                  </Typography>
                </Box>

                <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1, alignItems: "center" }}>
                  <Chip
                    label={`${pending} pending`}
                    size="small"
                    sx={{
                      bgcolor: pending > 0 ? "rgba(251,146,60,0.1)" : "rgba(100,116,139,0.08)",
                      color: pending > 0 ? "#ea580c" : "text.secondary",
                      fontSize: 11, fontWeight: 500,
                    }}
                  />
                  <Chip
                    label={`${completed} done`}
                    size="small"
                    sx={{
                      bgcolor: "rgba(22,163,74,0.08)", color: "#16a34a",
                      fontSize: 11, fontWeight: 500,
                    }}
                  />
                </Box>

                <Chip
                  label={user.category}
                  size="small"
                  sx={{
                    bgcolor: BLUE_LIGHT, color: BLUE,
                    fontSize: 12, fontWeight: 500,
                    display: { xs: "none", md: "flex" },
                  }}
                />

                <IconButton
                  size="small"
                  onClick={(e) => { e.stopPropagation(); navigate(`/user/${user.id}`); }}
                  sx={{
                    color: "text.secondary",
                    "&:hover": { color: BLUE, bgcolor: BLUE_LIGHT },
                  }}
                >
                  <ViewIcon fontSize="small" />
                </IconButton>
              </Box>
            );
          })}
        </Box>

        {filtered.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography sx={{ color: "text.secondary", fontSize: 15 }}>
              No users found
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
