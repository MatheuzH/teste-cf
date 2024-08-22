"use client"
import { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../services/firebaseConfig";
import { useRouter } from "next/navigation";
import "./login.css";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  if (error) {
    router.push("/registro"); 
    return (
      <div className="error-message">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  if (loading) {
    return <p className="loading-message">Carregando...</p>;
  }

  if (user) {
    router.push("/foods"); 
    return (
      <div className="user-registered">
        <p>Usuário Conectado: {user.user.email}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="title">Login</h1>
      <input
        className="input-field"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        className="input-field"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button className="register-button" onClick={() => signInWithEmailAndPassword(email, password)}>
        Entrar
      </button>
      <Link href="/registro">
        <button className="register-link-button">
          Criar uma conta
        </button>
      </Link>
    </div>
  );
}
