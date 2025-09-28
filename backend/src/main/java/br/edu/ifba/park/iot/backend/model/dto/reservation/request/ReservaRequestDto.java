package br.edu.ifba.park.iot.backend.model.dto.reservation.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReservaRequestDto {
  private Long recursoId;
  private String placaVeiculo;
  private String marcaVeiculo;
  private String modeloVeiculo;
}