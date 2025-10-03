"use client";
import React, { useState, useEffect } from "react";
import styles from "./StudentDirectory.module.css";
import InsightsBar from "./InsightsBar";
import { db } from "../lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";

function StudentDirectory({ onSelectStudent, quickFilter, setQuickFilter }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const statusOptions = ["Exploring", "Shortlisting", "Applying", "Submitted"];

  // State for new student form
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    phone: "",
    grade: "",
    country: "",
    status: "Exploring",
    lastActive: new Date().toISOString().slice(0, 10),
  });
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStudents() {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "students"));
      const studentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStudents(studentsData);
      setLoading(false);
    }
    fetchStudents();
  }, []);

  // Add student to Firestore
  async function handleAddStudent(e) {
    e.preventDefault();
    setAdding(true);
    setError("");
    try {
      const studentRef = await addDoc(collection(db, "students"), {
        ...newStudent,
        timeline: [],
        comms: [],
        notes: [],
      });
      // Log interaction: student added
      await addDoc(collection(db, `students/${studentRef.id}/interactions`), {
        type: "add",
        timestamp: Timestamp.now(),
        details: `Student ${newStudent.name} added`,
      });
      setNewStudent({
        name: "",
        email: "",
        phone: "",
        grade: "",
        country: "",
        status: "Exploring",
        lastActive: new Date().toISOString().slice(0, 10),
      });
      // Refresh students
      const querySnapshot = await getDocs(collection(db, "students"));
      setStudents(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      setError(err.message);
    }
    setAdding(false);
  }

  // Delete student from Firestore
  async function handleDeleteStudent(id) {
    // Log interaction: student deleted
    await addDoc(collection(db, `students/${id}/interactions`), {
      type: "delete",
      timestamp: Timestamp.now(),
      details: `Student ${id} deleted`,
    });
    await deleteDoc(doc(db, "students", id));
    setStudents(students.filter(s => s.id !== id));
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      !statusFilter || student.status === statusFilter;
    const matchesQuick =
      !quickFilter || student.status === quickFilter;
    return matchesSearch && matchesStatus && matchesQuick;
  });

  // Log interaction: directory view
  useEffect(() => {
    if (!loading) {
      students.forEach(student => {
        addDoc(collection(db, `students/${student.id}/interactions`), {
          type: "directory_view",
          timestamp: Timestamp.now(),
          details: `Directory viewed for ${student.name}`,
        });
      });
    }
  }, [loading]);

  if (loading) {
    return <div className={styles.directoryContainer}>Loading students...</div>;
  }

  return (
    <div className={styles.directoryContainer}>
      <h2 className={styles.title}>Student Directory</h2>
      <InsightsBar
        students={students}
        onQuickFilter={setQuickFilter}
        quickFilter={quickFilter}
      />
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={styles.statusSelect}
        >
          <option value="">All Statuses</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
      <form onSubmit={handleAddStudent} style={{ marginBottom: 24, background: "#f8f8ff", padding: 16, borderRadius: 8 }}>
        <h3>Add New Student</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input required placeholder="Name" value={newStudent.name} onChange={e => setNewStudent({ ...newStudent, name: e.target.value })} style={{ flex: 1 }} />
          <input required placeholder="Email" value={newStudent.email} onChange={e => setNewStudent({ ...newStudent, email: e.target.value })} style={{ flex: 1 }} />
          <input required placeholder="Phone" value={newStudent.phone} onChange={e => setNewStudent({ ...newStudent, phone: e.target.value })} style={{ flex: 1 }} />
          <input required placeholder="Grade" value={newStudent.grade} onChange={e => setNewStudent({ ...newStudent, grade: e.target.value })} style={{ flex: 1 }} />
          <input required placeholder="Country" value={newStudent.country} onChange={e => setNewStudent({ ...newStudent, country: e.target.value })} style={{ flex: 1 }} />
          <select value={newStudent.status} onChange={e => setNewStudent({ ...newStudent, status: e.target.value })} style={{ flex: 1 }}>
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={adding} style={{ marginTop: 12, background: "#0070f3", color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px", fontWeight: "bold" }}>Add Student</button>
        {error && <div style={{ color: "#d00", marginTop: 8 }}>{error}</div>}
      </form>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Country</th>
            <th>Status</th>
            <th>Last Active</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr
              key={student.id}
              className={styles.row}
              onClick={async () => {
                // Log interaction: profile view
                await addDoc(collection(db, `students/${student.id}/interactions`), {
                  type: "profile_view",
                  timestamp: Timestamp.now(),
                  details: `Profile viewed for ${student.name}`,
                });
                onSelectStudent(student);
              }}
            >
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.country}</td>
              <td>{student.status}</td>
              <td>{student.lastActive}</td>
              <td>
                <button onClick={e => {e.stopPropagation(); handleDeleteStudent(student.id);}} style={{ background: "#d00", color: "#fff", border: "none", borderRadius: 4, padding: "4px 8px", cursor: "pointer" }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentDirectory;
