package br.edu.ifba.park.iot.backend.model.dto.resource.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RecursoRequestDto {

  @NotBlank
  private String nome;

  @NotBlank
  private String status;

  @NotBlank
  private String tipo;
}