"use client";
import { useEffect, useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, db } from "../services/firebaseConfig";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import "./login.css";

interface User {
  id: string;
  email?: string;
  name?: string;
  telefone?: string;
  cpf?: string;
  dataCriacao?: Date;
}

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [telefone, setTelefone] = useState<string>("");
  const [cpf, setCpf] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);

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
    try {
      const userCredential = await createUserWithEmailAndPassword(email, password);
      const userId = userCredential.user.uid;

      await setDoc(doc(db, "Users", userId), {
        email: email,
        name: name,
        telefone: telefone,
        cpf: cpf,
        dataCriacao: new Date(),
      });

      router.push("/registro");

    } catch (error) {
      router.push("login");
    }
  };

  if (error) {
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
    return (
      <div className="user-registered">
        <p>Usuário Registrado: {user.user.email}</p>
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
        type="text"
        value={telefone}
        onChange={(e) => setTelefone(e.target.value)}
        placeholder="Número de Telefone"
      />
      <input
        className="input-field"
        type="text"
        value={cpf}
        onChange={(e) => setCpf(e.target.value)}
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
    </div>
  );
}
