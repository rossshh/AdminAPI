import { useState } from "react";
import { Box, Typography, Chip } from "@mui/material";
import {
  DragIndicator as DragIcon,
} from "@mui/icons-material";

const TaskBoard = ({ tasks, onTaskMove }) => {
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", task.id);
  };

  const handleDragOver = (e, column) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(column);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    if (draggedTask && draggedTask.status !== newStatus) {
      onTaskMove(draggedTask.id, newStatus);
    }
    setDraggedTask(null);
  };

  const columns = [
    {
      key: "pending",
      title: "Pending",
      tasks: pendingTasks,
      color: "#fb923c",
      bgColor: "rgba(251,146,60,0.08)",
      borderColor: "rgba(251,146,60,0.2)",
      chipBg: "rgba(251,146,60,0.15)",
    },
    {
      key: "completed",
      title: "Completed",
      tasks: completedTasks,
      color: "#34d399",
      bgColor: "rgba(52,211,153,0.08)",
      borderColor: "rgba(52,211,153,0.2)",
      chipBg: "rgba(52,211,153,0.15)",
    },
  ];

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
      {columns.map((col) => (
        <Box
          key={col.key}
          onDragOver={(e) => handleDragOver(e, col.key)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, col.key)}
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: dragOverColumn === col.key ? col.bgColor : "rgba(15,23,42,0.4)",
            border: `1.5px dashed ${dragOverColumn === col.key ? col.color : "rgba(148,163,184,0.12)"}`,
            transition: "all 0.25s ease",
            minHeight: 150,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 14, color: col.color }}>
              {col.title}
            </Typography>
            <Chip
              label={col.tasks.length}
              size="small"
              sx={{ bgcolor: col.chipBg, color: col.color, fontWeight: 700, fontSize: 12, minWidth: 28 }}
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {col.tasks.map((task) => (
              <Box
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "background.paper",
                  border: "1px solid rgba(148,163,184,0.1)",
                  cursor: "grab",
                  transition: "all 0.2s ease",
                  opacity: draggedTask?.id === task.id ? 0.4 : 1,
                  "&:hover": {
                    border: `1px solid ${col.borderColor}`,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    transform: "translateY(-1px)",
                  },
                  "&:active": { cursor: "grabbing" },
                }}
              >
                <DragIcon sx={{ fontSize: 16, color: "text.secondary", opacity: 0.5 }} />
                <Typography sx={{ fontSize: 13, color: "text.primary", fontWeight: 500, flex: 1 }}>
                  {task.title}
                </Typography>
              </Box>
            ))}

            {col.tasks.length === 0 && (
              <Box sx={{ py: 3, textAlign: "center" }}>
                <Typography sx={{ fontSize: 12, color: "text.secondary", fontStyle: "italic" }}>
                  Drop tasks here
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default TaskBoard;
