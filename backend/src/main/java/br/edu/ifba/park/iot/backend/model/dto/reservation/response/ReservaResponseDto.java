package br.edu.ifba.park.iot.backend.model.dto.reservation.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class ReservaResponseDto {
  private Long id;
  private Long recursoId;
  private String nomeRecurso;
  private String tipoVaga;
  private Long usuarioId;
  private String nomeUsuario;
  private String placaVeiculo;
  private String marcaVeiculo;
  private String modeloVeiculo;
  private String statusRecurso;

  @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
  private LocalDateTime horarioInicio;

  @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
  private LocalDateTime horarioFim;
}