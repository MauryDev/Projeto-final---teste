import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const CadastroVeiculo: React.FC = () => {
  const navigate = useNavigate();
  const [placa, setPlaca] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Supondo que você obtém o ID do usuário logado de um contexto ou estado global
      // Aqui, usamos um valor fixo como exemplo
      const usuarioId = 1;

      await api.post('/veiculos', {
        placa,
        marca,
        modelo,
        usuarioId
      });

      setSuccess('Veículo cadastrado com sucesso!');

      // Opcional: Limpar o formulário após o sucesso
      setPlaca('');
      setMarca('');
      setModelo('');

      // Redireciona o usuário para a página de vagas após 3 segundos
      setTimeout(() => {
        navigate('/vagas');
      }, 3000);

    } catch (err) {
      setError('Erro ao cadastrar o veículo. Verifique os dados ou tente novamente.');
      console.error('Erro na requisição da API:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card mx-auto" style={{ maxWidth: '500px' }}>
        <div className="card-header text-center">
          <h2>Cadastrar Veículo</h2>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="placa" className="form-label">Placa do Veículo</label>
              <input
                type="text"
                className="form-control"
                id="placa"
                value={placa}
                onChange={(e) => setPlaca(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="marca" className="form-label">Marca</label>
              <input
                type="text"
                className="form-control"
                id="marca"
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="modelo" className="form-label">Modelo</label>
              <input
                type="text"
                className="form-control"
                id="modelo"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                required
              />
            </div>
            <div className="d-grid gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Cadastrando...' : 'Confirmar Cadastro'}
              </button>
              <button
                type="button"
                className="btn btn-secondary mt-2"
                onClick={() => navigate(-1)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CadastroVeiculo;