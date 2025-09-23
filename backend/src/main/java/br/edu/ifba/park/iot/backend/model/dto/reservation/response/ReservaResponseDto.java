package br.edu.ifba.park.iot.backend.model.dto.reservation.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class ReservaResponseDto {
  private Long id;
  private Long recursoId;
  private String nomeRecurso;
  private Long usuarioId;
  private String nomeUsuario;
  private LocalDateTime horarioInicio;
  private LocalDateTime horarioFim;
}