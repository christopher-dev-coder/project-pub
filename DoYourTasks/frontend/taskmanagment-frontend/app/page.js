"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/auth");

      try {
        const res = await axios.get("http://localhost:3001/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTasks();
  }, []);

  const addTask = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post("http://localhost:3001/api/tasks", 
        { text: newTask }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([...tasks, res.data]);
      setNewTask("");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:3001/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/auth");
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h1 className="text-2xl mb-4">Tasks Managment</h1>
        <div className="mb-4">
          <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)}
            className="w-full p-2 border rounded"/>
          <button onClick={addTask} className="w-full bg-green-500 text-white p-2 rounded mt-2">
            Add a task
          </button>
        </div>
        <ul>
          {tasks.map((task) => (
            <li key={task._id} className="flex justify-between items-center bg-gray-200 p-2 my-1 rounded">
              <span>{task.text}</span>
              <button onClick={() => deleteTask(task._id)} className="bg-red-500 text-white px-2 py-1 rounded">
                Remove a task
              </button>
            </li>
          ))}
        </ul>
        <button onClick={logout} className="w-full bg-gray-500 text-white p-2 rounded mt-4">
          Sign out
        </button>
      </div>
    </div>
  );
}
