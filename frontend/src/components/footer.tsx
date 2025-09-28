import React from 'react';

// interface para as propriedades do componente
interface FooterProps {
  style?: React.CSSProperties;
}

export default function Footer({ style }: FooterProps) {
  return (
    <footer className="footer bg-dark text-light" style={style}>
      <p>© 2025 Park - Todos os direitos reservados</p>
    </footer>
  );
}