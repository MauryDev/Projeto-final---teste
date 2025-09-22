import aboutImg from "../assets/img/about-img.jpg";
import pricingBg from "../assets/img/pricing-bg.jpg";
import sliderBg from "../assets/img/slider-bg.jpg";

export default function Home() {
  return (
    <div className="bg-light">
      {/* Carrossel */}
      <div
        id="carouselHome"
        className="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval="5000" // autoplay 5 segundos
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src={sliderBg}
              className="d-block w-100 carousel-img"
              alt="Estacionamento moderno"
            />
            <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 p-3 rounded shadow">
              <h2 className="fw-bold text-white">Estacionamento Inteligente</h2>
              <p className="text-white">Tecnologia e praticidade para o seu dia a dia</p>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src={pricingBg}
              className="d-block w-100 carousel-img"
              alt="Segurança total"
            />
            <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 p-3 rounded shadow">
              <h2 className="fw-bold text-white">Segurança e Conforto</h2>
              <p className="text-white">Vagas amplas e monitoradas 24h</p>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src={aboutImg}
              className="d-block w-100 carousel-img"
              alt="Sensores modernos"
            />
            <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 p-3 rounded shadow">
              <h2 className="fw-bold text-white">Sensores Inteligentes</h2>
              <p className="text-white">Disponível em verde, ocupado em vermelho</p>
            </div>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselHome"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Anterior</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselHome"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Próximo</span>
        </button>
      </div>

      {/* Propaganda - Vagas amplas e seguras */}
      <section className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-6">
            <img
              src={pricingBg}
              alt="Estacionamento amplo e seguro"
              className="img-fluid rounded shadow"
            />
          </div>
          <div className="col-md-6">
            <h2 className="text-primary fw-bold mb-3">Vagas Amplas e Seguras</h2>
            <p className="fs-5 text-muted">
              Oferecemos vagas modernas e monitoradas, garantindo total tranquilidade
              ao estacionar. Seu carro fica protegido em um ambiente planejado para
              praticidade e segurança.
            </p>
          </div>
        </div>
      </section>

      {/* Propaganda - Sensores inteligentes */}
      <section className="container py-5">
        <div className="row align-items-center flex-md-row-reverse">
          <div className="col-md-6">
            <img
              src={aboutImg}
              alt="Sensores inteligentes"
              className="img-fluid rounded shadow"
            />
          </div>
          <div className="col-md-6">
            <h2 className="text-success fw-bold mb-3">Sensores Inteligentes</h2>
            <p className="fs-5 text-muted">
              Vagas equipadas com sensores de última geração que mudam automaticamente
              para <span className="text-success fw-semibold">verde</span> quando disponíveis e
              <span className="text-danger fw-semibold"> vermelho</span> quando ocupadas.
              Mais praticidade, menos tempo perdido procurando vaga.
            </p>
          </div>
        </div>
      </section>

      {/* CSS customizado */}
      <style>{`
        .carousel-img {
          max-height: 500px;
          object-fit: cover;
        }
      `}</style>
    </div>
  );
}