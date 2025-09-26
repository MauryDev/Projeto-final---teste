package br.edu.ifba.park.iot.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import br.edu.ifba.park.iot.backend.security.model.Usuario;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "reservas")
public class Reserva {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "recurso_id", nullable = false)
  private Recurso recurso;

  @Column(name = "horario_inicio", nullable = false)
  @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
  private LocalDateTime horarioInicio;

  @Column(name = "horario_fim", nullable = true)
  @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
  private LocalDateTime horarioFim;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "usuario_id", nullable = false)
  private Usuario usuario;

  @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
  @JoinColumn(name = "veiculo_id", nullable = false)
  private Veiculo veiculo;
}