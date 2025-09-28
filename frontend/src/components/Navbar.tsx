import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { username, logout, role } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const isAdmin = role === "ADMIN"; // Verifica se o perfil é de ADMIN

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-md">
      <div className="container-fluid max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link className="navbar-brand font-bold text-xl" to="/">
          <img
            src="/favicon.png"
            alt="Logo do Estacionamento"
            className="rounded-sm me-2"
            style={{ height: '24px', width: 'auto' }}
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">Home</Link>
            </li>
            {username && (
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle bg-transparent border-0 text-white hover:text-white focus:text-white"
                  id="parkDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ backgroundColor: 'transparent' }}
                >
                  <i className="bi bi-p-square-fill me-1"></i> Park
                </button>
                <ul className="dropdown-menu" aria-labelledby="parkDropdown">
                  <li>
                    <Link className="dropdown-item" to="/vagas">
                      <i className="bi bi-geo-alt-fill me-2"></i> Ver Vagas
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/minhas-reservas">
                      <i className="bi bi-calendar-check-fill me-2"></i> Minhas Reservas
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/gerenciar-veiculos">
                      <i className="bi bi-car-front-fill me-2"></i> Gerenciar Veículos
                    </Link>
                  </li>
                </ul>
              </li>
            )}
          </ul>
          <ul className="navbar-nav">
            {!username ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/cadastro">Cadastro</Link>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle me-2"></i> {username}
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li>
                    <Link className="dropdown-item" to="/perfil">
                      <i className="bi bi-person-lines-fill me-2"></i> Perfil
                    </Link>
                  </li>

                  {/* Gerenciamento de Vagas - Visível apenas para ADMIN */}
                  {isAdmin && (
                    <>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <Link className="dropdown-item" to="/gerenciar-vagas">
                          <i className="bi bi-layout-text-window-reverse me-2"></i> Gestão de Vagas
                        </Link>
                      </li>
                    </>
                  )}

                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i> Sair
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}