import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { ClienteService, ClienteForm } from "../api/clienteService";

export default function PerfilUsuario() {
  const { id: userId, loading: authLoading, setUsername } = useAuth();
  const [cliente, setCliente] = useState<ClienteForm | null>(null);
  const [formData, setFormData] = useState<ClienteForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Carrega os dados do cliente
  useEffect(() => {
    if (!userId) {
      setError("Usuário não autenticado");
      setLoading(false);
      return;
    }

    const fetchCliente = async () => {
      try {
        const data = await ClienteService.fetchClienteByUsuarioId(userId);
        if (!data) setError("Cliente não encontrado");
        else {
          setCliente(data);
          setFormData(data);
        }
      } catch (err) {
        console.error("Erro ao carregar cliente:", err);
        setError("Erro ao carregar dados do cliente");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) fetchCliente();
  }, [userId, authLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSave = async () => {
    if (!formData) return;

    try {
      const payload: ClienteForm = {
        ...formData,
        telefone: formData.telefone ?? "",
        email: formData.email ?? "",
      };

      const updated = await ClienteService.updateCliente(payload);

      // Atualiza dados no state
      setCliente(updated);
      setFormData(updated);
      setIsEditing(false);

      // Atualiza username global do contexto (Navbar)
      setUsername(updated.email);

      alert("Perfil atualizado com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar perfil");
    }
  };

  const handleChangePassword = () => {
    // Aqui você pode abrir um modal ou redirecionar para página de alteração de senha
    alert("Função Alterar Senha ainda não implementada");
  };

  if (loading || authLoading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;
  if (!cliente || !formData) return <p>Cliente não encontrado</p>;

  return (
    <div className="container mt-5">
      <div className="mx-auto" style={{ maxWidth: "600px" }}>
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0">Perfil do Cliente</h4>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Nome</label>
                <input
                  type="text"
                  name="nome"
                  className="form-control"
                  value={formData.nome}
                  onChange={handleChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">CPF</label>
                <input
                  type="text"
                  name="cpf"
                  className="form-control"
                  value={formData.cpf}
                  onChange={handleChange}
                  readOnly={!isEditing}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Telefone</label>
                <input
                  type="text"
                  name="telefone"
                  className="form-control"
                  value={formData.telefone}
                  onChange={handleChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  readOnly={!isEditing}
                />
              </div>
            </div>

            <div className="d-flex justify-content-between">
              {!isEditing ? (
                <button
                  className="btn btn-outline-primary"
                  onClick={() => setIsEditing(true)}
                >
                  Editar Perfil
                </button>
              ) : (
                <button className="btn btn-success" onClick={handleSave}>
                  Salvar
                </button>
              )}
              <button
                className="btn btn-outline-warning"
                onClick={handleChangePassword}
              >
                Alterar Senha
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
