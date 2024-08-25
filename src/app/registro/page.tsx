"use client";
import { useEffect, useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, db } from "../services/firebaseConfig";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./login.css";

interface User {
  id: string;
  email?: string;
  name?: string;
  telefone?: Number;
  cpf?: Number;
  dataCriacao?: Date;
}

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [telefone, setTelefone] = useState<number>();
  const [cpf, setCpf] = useState<number>();
  const [password, setPassword] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  const userCollectionRef = collection(db, "Users");

  const router = useRouter();

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(userCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as User)));
    };
    getUsers();
  }, [userCollectionRef]);

  const Registrar = async () => {
    const userCredential = await createUserWithEmailAndPassword(
      email,
      password
    );
    if (userCredential && userCredential.user) {
      const userId = userCredential.user.uid;

      await setDoc(doc(db, "Users", userId), {
        email: email,
        name: name,
        telefone: telefone,
        cpf: cpf,
        dataCriacao: new Date(),
      });

      setMessage("Usuário registrado com sucesso!");
      setTimeout(() => {
        router.push("/foods");
      }, 2000);
    } else {
      setMessage("Erro ao registrar usuário. Por favor, tente novamente.");
      setTimeout(() => {
        router.push("/registro");
        window.location.reload();
      }, 2000);
    }
  };

  if (loading) {
    return <p className="loading-message">Carregando...</p>;
  }

  if (message) {
    return (
      <div className={`message ${error ? "error" : "success"}`}>
        <p>{message}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="title">Cadastro de Usuário</h1>
      <input
        className="input-field"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        className="input-field"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome"
      />
      <input
        className="input-field"
        type="number"
        value={telefone}
        onChange={(e) => {
          const value = Number(e.target.value);
          if (!isNaN(value)) {
            setTelefone(value);
          }
        }}
        placeholder="Número de Telefone"
      />
      <input
        className="input-field"
        type="number"
        value={cpf}
        onChange={(e) => {
          const value = Number(e.target.value);
          if (!isNaN(value)) {
            setCpf(value);
          }
        }}
        placeholder="CPF"
      />
      <input
        className="input-field"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button className="register-button" onClick={Registrar}>
        Registrar
      </button>
      <Link href="/login">
        <button className="register-button">Login</button>
      </Link>
      <p>A senha deve conter no mínimo 6 dígitos</p>
    </div>
  );
}
