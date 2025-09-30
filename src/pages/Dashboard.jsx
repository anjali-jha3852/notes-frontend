import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/api"; // make sure file is exactly api.jsx

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");         // initialize as string
  const [description, setDescription] = useState("");
  const [showCompleted, setShowCompleted] = useState(true);
  const [showNotCompleted, setShowNotCompleted] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Redirect if not logged in
  useEffect(() => {
    if (!token) navigate("/");
  }, [token, navigate]);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      // Ensure title/description are strings to prevent controlled input warnings
      const fixedTasks = res.data.map((t) => ({
        ...t,
        title: t.title || "",
        description: t.description || "",
      }));
      setTasks(fixedTasks);
    } catch (err) {
      console.error("Error fetching tasks:", err.response?.data || err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add new task
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return; // prevent empty title
    try {
      await api.post("/tasks", { title, description, completed: false });
      setTitle("");
      setDescription("");
      fetchTasks();
    } catch (err) {
      console.error("Error adding task:", err.response?.data || err);
    }
  };

  // Delete task
  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err.response?.data || err);
    }
  };

  // Toggle completion
  const handleToggleComplete = async (task) => {
    try {
      const updatedTask = { ...task, completed: !task.completed };
      await api.put(`/tasks/${task._id}`, { completed: updatedTask.completed });
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? updatedTask : t))
      );
    } catch (err) {
      console.error("Error updating task:", err.response?.data || err);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (task.completed && !showCompleted) return false;
    if (!task.completed && !showNotCompleted) return false;
    return true;
  });

  // Sort uncompleted first
  const sortedTasks = [...filteredTasks].sort((a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1
  );

  return (
    <div className="flex items-center justify-center p-0">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-xl p-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">My Tasks</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-6 mb-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={() => setShowCompleted(!showCompleted)}
            />
            Show Completed
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showNotCompleted}
              onChange={() => setShowNotCompleted(!showNotCompleted)}
            />
            Show Not Completed
          </label>
        </div>

        {/* Add Task */}
        <form
          onSubmit={handleAdd}
          className="flex flex-col sm:flex-col flex-nowrap gap-3 mb-6"
        >
          <input
            type="text"
            placeholder="Task Title"
            className="border p-3 flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Description"
            className="border p-3 flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition"
          >
            Add
          </button>
        </form>

        {/* Task List */}
        <ul className="space-y-4">
          <AnimatePresence>
            {sortedTasks.map((task) => (
              <motion.li
                key={task._id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                className="flex justify-between items-center bg-gray-50 p-5 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col items-center gap-4">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task)}
                    className="w-5 h-5"
                  />
                  <div>
                    <h3
                      className={`font-semibold text-lg ${
                        task.completed ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {task.title}
                    </h3>
                    <p
                      className={`text-gray-500 ${
                        task.completed ? "line-through" : ""
                      }`}
                    >
                      {task.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="text-red-500 hover:underline font-medium"
                >
                  Delete
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
