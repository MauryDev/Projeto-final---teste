import React from "react";
import { useAuth } from "../../hooks/useAuth";

export default function Home() {
  const { username } = useAuth();

  return (
    <div className="container mt-5">
      <h1>Bem-vindo{username ? `, ${username}` : ""}!</h1>
      <p>Esta é a página inicial.</p>
    </div>
  );
}
