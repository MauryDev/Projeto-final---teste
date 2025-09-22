import React from "react";
import sliderBg from "../assets/img/slider-bg.jpg";
import pricingBg from "../assets/img/pricing-bg.jpg";
import aboutImg from "../assets/img/about-img.jpg";

export default function Home() {
  return (
    <div>
      {/* Imagem central */}
      <div
        style={{
          width: "100%",
          height: "100vh",
          backgroundImage: `url(${sliderBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          textShadow: "1px 1px 5px rgba(0,0,0,0.7)",
          fontSize: "3rem",
          fontWeight: "bold",
        }}
      >
        Estacione com Inteligência
      </div>

      {/* Seção Pricing / propaganda */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 20px",
          gap: "40px",
          flexWrap: "wrap",
          backgroundColor: "#f9f9f9",
        }}
      >
        <img
          src={pricingBg}
          alt="Vagas amplas e seguras"
          style={{ maxWidth: "500px", borderRadius: "12px", flex: "1" }}
        />
        <div style={{ maxWidth: "500px", flex: "1" }}>
          <h2>Vagas amplas e seguras</h2>
          <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
            Nosso estacionamento inteligente oferece vagas amplas e confortáveis, com segurança completa para seu veículo. 
            Garanta tranquilidade e praticidade ao estacionar, com monitoramento em tempo real e seguro incluso.
          </p>
        </div>
      </div>

      {/* Seção About / sensores */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 20px",
          gap: "40px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ maxWidth: "500px", flex: "1" }}>
          <h2>Sensores inteligentes</h2>
          <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
            Cada vaga possui sensores que indicam disponibilidade em tempo real: verde se livre, vermelho se ocupada. 
            Nossos sistemas são constantemente atualizados para garantir uma experiência rápida, prática e segura.
          </p>
        </div>
        <img
          src={aboutImg}
          alt="Sensores inteligentes"
          style={{ maxWidth: "500px", borderRadius: "12px", flex: "1" }}
        />
      </div>
    </div>
  );
}
