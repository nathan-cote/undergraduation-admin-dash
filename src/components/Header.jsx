import styles from "./Header.module.css";
import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Header({ user, onLogout }) {
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    async function fetchName() {
      if (user) {
        const ref = doc(db, "admins", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setAdminName(snap.data().name);
        } else {
          setAdminName("");
        }
      }
    }
    fetchName();
  }, [user]);

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <span className={styles.brand}>Undergraduation.com</span>
      </div>
      <nav className={styles.nav}>
        {user ? (
          <>
            <span className={styles.link} style={{ marginRight: 16 }}>Welcome, {adminName || user.email}</span>
            <button className={styles.button} onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            <a href="/auth" className={styles.link}>Sign in</a>
            <a href="/auth" className={styles.button}>Sign up</a>
          </>
        )}
      </nav>
    </header>
  );
}
