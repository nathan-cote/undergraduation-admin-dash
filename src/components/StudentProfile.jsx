import { db } from "../lib/firebase";
import { collection, getDocs, updateDoc, doc, arrayUnion } from "firebase/firestore";
import styles from "./StudentProfile.module.css";
import React, { useState, useEffect } from "react";
function ProgressBar({ stage }) { 
  const stages = ["Exploring", "Shortlisting", "Applying", "Submitted"];
  const currentIdx = stages.indexOf(stage);
  return (
    <div className={styles.progressBar}>
      {stages.map((s, idx) => (
        <div key={s} className={styles.progressStep}>
          <div
            className={
              idx <= currentIdx ? styles.activeStep : styles.inactiveStep
            }
          >
            {s}
          </div>
          {idx < stages.length - 1 && <span className={styles.arrow}>→</span>}
        </div>
      ))}
    </div>
  );
}

export default function StudentProfile({ student, onBack }) {
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState("");
  // Add communication log entry
  const handleAddComm = async (commObj) => {
    setComms(prev => [...prev, commObj]);
    await updateDoc(doc(db, "students", student.id), {
      comms: arrayUnion(commObj)
    });
  };
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [interactions, setInteractions] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [comms, setComms] = useState([]);

  useEffect(() => {
    async function fetchStudentData() {
      if (!student.id) return;
      // Fetch interactions
      const interactionsSnap = await getDocs(collection(db, `students/${student.id}/interactions`));
      setInteractions(interactionsSnap.docs.map(doc => doc.data()));
      // Fetch student document for timeline, comms, notes
      const studentDocSnap = await getDocs(collection(db, "students"));
      const studentDoc = studentDocSnap.docs.find(d => d.id === student.id);
      if (studentDoc) {
        const data = studentDoc.data();
        setTimeline(data.timeline || []);
        setComms(data.comms || []);
        setNotes(data.notes || []);
        setReminders(data.reminders || []);
      }
    }
    fetchStudentData();
  }, [student.id]);

  // Add reminder
  const handleAddReminder = async () => {
    if (newReminder.trim()) {
      const reminderObj = { id: Date.now(), text: newReminder, date: new Date().toLocaleDateString() };
      setReminders(prev => [...prev, reminderObj]);
      setNewReminder("");
      await updateDoc(doc(db, "students", student.id), {
        reminders: arrayUnion(reminderObj)
      });
    }
  };

  const handleAddNote = async () => {
    if (newNote.trim()) {
      const noteObj = { id: Date.now(), text: newNote };
      setNotes([...notes, noteObj]);
      setNewNote("");
      // Update Firestore
      await updateDoc(doc(db, "students", student.id), {
        notes: arrayUnion(noteObj)
      });
    }
  };

  const handleDeleteNote = async (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    // Update Firestore
    await updateDoc(doc(db, "students", student.id), {
      notes: updatedNotes
    });
  };


  return (
    <div className={styles.profileContainer}>
      <button className={styles.backBtn} onClick={onBack}>&larr; Back to Directory</button>
      <h2 className={styles.title}>{student.name}'s Profile</h2>
      <div className={styles.infoSection}>
        <div><strong>Name:</strong> {student.name}</div>
        <div><strong>Email:</strong> {student.email}</div>
        <div><strong>Phone:</strong> {student.phone}</div>
        <div><strong>Grade:</strong> {student.grade}</div>
        <div><strong>Country:</strong> {student.country}</div>
      </div>
      <ProgressBar stage={student.status} />
      {/* Communication Tools box removed as requested */}
      {/* Removed Interaction Timeline section as requested */}
      <div className={styles.section}>
        <h3>Communication Log</h3>
        <ul>
          {comms.map((item, idx) => (
            <li key={idx}>{item.date}: {item.type} - {item.detail}</li>
          ))}
        </ul>
        <div className={styles.addNoteRow}>
          {/* Manual log entry */}
          <input
            type="text"
            placeholder="Log communication (e.g., 'Called student to discuss essays')"
            className={styles.noteInput}
            onKeyDown={e => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                handleAddComm({
                  date: new Date().toLocaleDateString(),
                  type: 'Manual',
                  detail: e.target.value.trim()
                });
                e.target.value = '';
              }
            }}
          />
          {/* Mock follow-up email trigger */}
          <button className={styles.addBtn} onClick={() => {
            handleAddComm({
              date: new Date().toLocaleDateString(),
              type: 'Email',
              detail: 'Triggered follow-up email (mock)'
            });
            alert('Mock: Follow-up email triggered!');
          }}>Send Follow-up Email (Mock)</button>
        </div>
      </div>
      <div className={styles.section}>
        <h3>Reminders</h3>
        <ul>
          {reminders.map((reminder) => (
            <li key={reminder.id}>{reminder.date}: {reminder.text}</li>
          ))}
        </ul>
        <div className={styles.addNoteRow}>
          <input
            type="text"
            value={newReminder}
            onChange={e => setNewReminder(e.target.value)}
            placeholder="Schedule a reminder/task for internal team"
            className={styles.noteInput}
          />
          <button className={styles.addBtn} onClick={handleAddReminder}>Add Reminder</button>
        </div>
      </div>
      <div className={styles.section}>
        <h3>Internal Notes</h3>
        <ul>
          {notes.map((note) => (
            <li key={note.id}>
              {note.text}
              <button className={styles.deleteBtn} onClick={() => handleDeleteNote(note.id)}>Delete</button>
            </li>
          ))}
        </ul>
        <div className={styles.addNoteRow}>
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..."
            className={styles.noteInput}
          />
          <button className={styles.addBtn} onClick={handleAddNote}>Add</button>
        </div>
      </div>
      <div className={styles.section}>
        <h3>Interaction Log</h3>
        {interactions.length === 0 ? (
          <div>No interactions logged.</div>
        ) : (
          <ul>
            {interactions.map((interaction, idx) => (
              <li key={idx}>
                <strong>{interaction.type}</strong> - {interaction.details} <em>({interaction.timestamp?.seconds ? new Date(interaction.timestamp.seconds * 1000).toLocaleString() : ""})</em>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className={styles.section}>
        <h3>AI Summary</h3>
        <div className={styles.aiSummary}>
          This student is highly engaged, has submitted key documents, and is currently in the "{student.status}" stage. Recommend sending essay help resources.
        </div>
      </div>
    </div>
  );
}
