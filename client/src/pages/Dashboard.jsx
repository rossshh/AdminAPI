import { useEffect, useState } from "react";
import { getUsers } from "../services/userService";
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Avatar, IconButton,
  Paper, AppBar, Toolbar, TextField, InputAdornment,
} from "@mui/material";
import { Search as SearchIcon, Visibility as ViewIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>

      <Box className='p-3 md:ml-50 md:mr-50 md:mt-10'>
        <TableContainer>
          <Table>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="hover cursor-pointer" onClick={() => navigate(`/user/${user.id}`)}>
                  <TableCell>
                    <Box className="flex align-center gap-2.5 text-lg"  >
                      <Avatar className="w-36 h-36 text-xs font-semibold">
                      </Avatar>
                      {user.name}
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="primary" onClick={(e) => { navigate(`/user/${user.id}`); }}>
                      <ViewIcon/>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Dashboard;
