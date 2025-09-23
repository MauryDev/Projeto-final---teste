package br.edu.ifba.park.iot.backend.model.dto.resource.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RecursoResponseDto {
  private Long id;
  private String nome;
  private String status;
  private String tipo;
}