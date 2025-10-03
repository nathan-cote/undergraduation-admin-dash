"use client";

import Header from "../../components/Header";
import React, { useState, useEffect } from "react";
import StudentDirectory from "../../components/StudentDirectory";
import StudentProfile from "../../components/StudentProfile";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        router.replace("/auth");
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (!user) {
    return <div style={{ textAlign: "center", marginTop: 80 }}>Checking authentication...</div>;
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Header user={user} onLogout={() => signOut(auth)} />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 0' }}>
        {!selectedStudent ? (
          <StudentDirectory onSelectStudent={setSelectedStudent} />
        ) : (
          <StudentProfile student={selectedStudent} onBack={() => setSelectedStudent(null)} />
        )}
      </main>
    </div>
  );
}
