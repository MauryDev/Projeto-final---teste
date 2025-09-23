package br.edu.ifba.park.iot.backend.model;

import br.edu.ifba.park.iot.backend.security.model.Usuario;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "veiculos")
public class Veiculo {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "placa", nullable = false, unique = true)
  private String placa;

  @Column(name = "marca", nullable = false)
  private String marca;

  @Column(name = "modelo", nullable = false)
  private String modelo;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "usuario_id", nullable = false)
  private Usuario usuario;
}