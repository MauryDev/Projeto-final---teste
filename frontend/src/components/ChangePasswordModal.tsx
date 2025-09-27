import React, { useState } from "react";
import Swal from "sweetalert2";
import { ClienteService } from "../api/clienteService";
import { useAuth } from "../hooks/useAuth";

interface ChangePasswordModalProps {
  show: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ show, onClose }) => {
  const { id: userId } = useAuth();
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");

  const resetForm = () => {
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmaSenha("");
  };

  const handleSavePassword = async () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=\S+$).{8,30}$/;

    if (!senhaAtual) {
      Swal.fire({
        icon: 'warning',
        title: 'Atenção',
        text: 'Por favor, digite sua senha atual.'
      });
      return;
    }

    if (novaSenha !== confirmaSenha) {
      Swal.fire({
        icon: 'error',
        title: 'Erro de validação',
        text: 'A nova senha e a confirmação não coincidem.'
      });
      return;
    }

    if (!passwordRegex.test(novaSenha)) {
      Swal.fire({
        icon: 'warning',
        title: 'Senha inválida',
        text: 'A nova senha deve ter de 8 a 30 caracteres, com pelo menos uma letra maiúscula, uma minúscula e um caractere especial.'
      });
      return;
    }

    try {
      if (!userId) {
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: 'ID do usuário não encontrado. Por favor, faça login novamente.'
        });
        return;
      }

      await ClienteService.changeUserPassword(userId, {
        senhaAtual: senhaAtual,
        novaSenha: novaSenha,
        confirmaSenha: confirmaSenha
      });

      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Senha alterada com sucesso.',
        timer: 2000,
        showConfirmButton: false
      });

      resetForm(); // Limpa o formulário antes de fechar
      onClose(); // Fecha o modal após o sucesso
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: 'Sua senha atual está incorreta. Verifique e tente novamente.'
      });
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg rounded-4">
          <div className="modal-header bg-primary text-dark rounded-top-4 p-4">
            <h5 className="modal-title fw-bold">Alterar Senha</h5>
            <button type="button" className="btn-close" onClick={() => { resetForm(); onClose(); }}></button>
          </div>
          <div className="modal-body p-4">
            <div className="mb-3">
              <label htmlFor="senha-atual" className="form-label">Senha Atual</label>
              <input
                type="password"
                className="form-control"
                id="senha-atual"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="nova-senha" className="form-label">Nova Senha</label>
              <input
                type="password"
                className="form-control"
                id="nova-senha"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmar-senha" className="form-label">Confirmar Nova Senha</label>
              <input
                type="password"
                className="form-control"
                id="confirmar-senha"
                value={confirmaSenha}
                onChange={(e) => setConfirmaSenha(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer d-flex justify-content-between">
            <button type="button" className="btn btn-outline-secondary" onClick={() => { resetForm(); onClose(); }}>
              Cancelar
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSavePassword}>
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};