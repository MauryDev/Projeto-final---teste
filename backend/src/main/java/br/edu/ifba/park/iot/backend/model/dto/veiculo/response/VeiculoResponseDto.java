package br.edu.ifba.park.iot.backend.model.dto.veiculo.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VeiculoResponseDto {

  private Long id;
  private String placa;
  private String marca;
  private String modelo;
  private Long usuarioId;
}