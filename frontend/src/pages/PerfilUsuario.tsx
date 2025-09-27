import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getUsuarioById } from "../api/usuarioService";

interface Usuario {
  id: number;
  username: string;
  role: string;
  nome?: string;
}

export default function PerfilUsuario() {
  const { token } = useAuth(); // token do contexto
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId"); // id salvo no login
    if (!userId || !token) {
      setError("Usuário não autenticado");
      setLoading(false);
      return;
    }

    getUsuarioById(Number(userId))
      .then((data) => {
        if (!data) {
          setError("Usuário não encontrado");
        } else {
          setUsuario(data);
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar usuário:", err);
        setError("Erro ao carregar dados do usuário");
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;
  if (!usuario) return <p>Usuário não encontrado</p>;

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Perfil do Usuário</h4>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">ID</label>
              <input type="text" className="form-control" value={usuario.id} readOnly />
            </div>
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input type="text" className="form-control" value={usuario.username} readOnly />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Nome</label>
              <input
                type="text"
                className="form-control"
                value={usuario.nome ?? "Não informado"}
                readOnly
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Perfil</label>
              <input type="text" className="form-control" value={usuario.role} readOnly />
            </div>
          </div>

          <div className="d-flex justify-content-between">
            <button className="btn btn-outline-primary">Editar Perfil</button>
            <button className="btn btn-outline-warning">Alterar Senha</button>
          </div>
        </div>
      </div>
    </div>
  );
}
