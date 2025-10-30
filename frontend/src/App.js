import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [students, setStudents] = useState([]);

  const api = "http://localhost:5001/api"; // match your backend port (5000 or 5001)

  useEffect(() => {
    if (token) loadStudents();
  }, [token]);

  const register = async () => {
    try {
      await axios.post(`${api}/auth/register`, { email, password: pw });
      alert("Registered successfully! Now login.");
    } catch (err) {
      alert(err.response?.data?.msg || "Error registering");
    }
  };

  const login = async () => {
    try {
      const res = await axios.post(`${api}/auth/login`, {
        email,
        password: pw,
      });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
    } catch (err) {
      alert(err.response?.data?.msg || "Error logging in");
    }
  };

  const loadStudents = async () => {
    try {
      const res = await axios.get(`${api}/students`, {
        headers: { Authorization: "Bearer " + token },
      });
      setStudents(res.data);
    } catch (err) {
      alert("Failed to load students");
    }
  };

  const addStudent = async () => {
    const name = prompt("Enter student name");
    if (!name) return;
    await axios.post(
      `${api}/students`,
      { name, rollNo: "R1", course: "BSc", feesPaid: 0, feesDue: 1000 },
      { headers: { Authorization: "Bearer " + token } }
    );
    loadStudents();
  };

  return (
  <div className="container">
      <h2>College Management System</h2>

      {!token ? (
        <div>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
          <br />
          <button onClick={register}>Register</button>
          <button onClick={login}>Login</button>
        </div>
      ) : (
        <div>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              setToken("");
            }}
          >
            Logout
          </button>
          <button onClick={addStudent}>Add Student</button>

          <h3>Students</h3>
          <ul>
            {students.map((s) => (
              <li key={s._id}>
                {s.name} — {s.course} — Fees Due: {s.feesDue}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;

