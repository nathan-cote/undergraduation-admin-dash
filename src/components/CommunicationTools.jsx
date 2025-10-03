import React, { useState } from "react";
import styles from "./CommunicationTools.module.css";

export default function CommunicationTools({ student }) {
  const [log, setLog] = useState("");
  const [reminder, setReminder] = useState("");
  const [logs, setLogs] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [emailSent, setEmailSent] = useState(false);

  const handleAddLog = () => {
    if (log.trim()) {
      setLogs([...logs, { text: log, date: new Date().toISOString().slice(0, 10) }]);
      setLog("");
    }
  };

  const handleAddReminder = () => {
    if (reminder.trim()) {
      setReminders([...reminders, { text: reminder, date: new Date().toISOString().slice(0, 10) }]);
      setReminder("");
    }
  };

  const handleSendEmail = () => {
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 2000);
  };

  return (
    <div className={styles.toolsContainer}>
      <h3>Communication Tools</h3>
      <div className={styles.row}>
        <input
          type="text"
          value={log}
          onChange={(e) => setLog(e.target.value)}
          placeholder="Log a communication..."
          className={styles.input}
        />
        <button className={styles.btn} onClick={handleAddLog}>Log</button>
      </div>
      <ul className={styles.list}>
        {logs.map((item, idx) => (
          <li key={idx}>{item.date}: {item.text}</li>
        ))}
      </ul>
      <div className={styles.row}>
        <input
          type="text"
          value={reminder}
          onChange={(e) => setReminder(e.target.value)}
          placeholder="Schedule a reminder/task..."
          className={styles.input}
        />
        <button className={styles.btn} onClick={handleAddReminder}>Schedule</button>
      </div>
      <ul className={styles.list}>
        {reminders.map((item, idx) => (
          <li key={idx}>{item.date}: {item.text}</li>
        ))}
      </ul>
      <div className={styles.row}>
        <button className={styles.emailBtn} onClick={handleSendEmail} disabled={emailSent}>
          {emailSent ? "Email Sent!" : "Trigger Follow-up Email (Mock)"}
        </button>
      </div>
    </div>
  );
}
