import React from "react";

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  iconColor?: string;
  children: React.ReactNode;
  subtitleStyle?: React.CSSProperties
};

export default function AuthLayout({
  title,
  subtitle,
  iconColor = "#ffc107",
  children,
  subtitleStyle,
}: AuthLayoutProps) {
  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        background: "linear-gradient(to right, #1e3c72, #2a5298)",
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{ width: "100%", maxWidth: "400px", borderRadius: "12px" }}
      >
        <div className="text-center mb-4">
          <img
            src="/favicon.png"
            alt="Logo"
            style={{ width: "3rem", height: "3rem", objectFit: "contain" }}
          />
          <h3 className="mt-2" style={{ color: "#2a5298", fontWeight: "bold" }}>
            {title}
          </h3>
          <p className="text-muted" style={subtitleStyle}>
            {subtitle}
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}
