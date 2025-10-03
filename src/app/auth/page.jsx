"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../lib/firebase";
import { setDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        setSuccess("Login successful!");
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        // Save admin name to Firestore
        await setDoc(doc(db, "admins", userCred.user.uid), {
          name,
          email,
          createdAt: new Date().toISOString()
        });
        setSuccess("Account created!");
      }
      setTimeout(() => router.replace("/dashboard"), 800);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: 32, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #eee" }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>{isLogin ? "Admin Login" : "Admin Sign Up"}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            style={{ width: "100%", padding: 10, marginBottom: 16, borderRadius: 6, border: "1px solid #ccc" }}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: 10, marginBottom: 16, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: 10, marginBottom: 16, borderRadius: 6, border: "1px solid #ccc" }}
        />
        {error && <div style={{ color: "#d00", marginBottom: 12 }}>{error}</div>}
        {success && <div style={{ color: "#090", marginBottom: 12 }}>{success}</div>}
        <button type="submit" disabled={loading} style={{ width: "100%", padding: 12, background: "#0070f3", color: "#fff", border: "none", borderRadius: 6, fontWeight: "bold" }}>
          {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
        </button>
      </form>
      <div style={{ textAlign: "center", marginTop: 18 }}>
        <button onClick={() => setIsLogin(!isLogin)} style={{ background: "none", border: "none", color: "#0070f3", cursor: "pointer" }}>
          {isLogin ? "Create an account" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}
