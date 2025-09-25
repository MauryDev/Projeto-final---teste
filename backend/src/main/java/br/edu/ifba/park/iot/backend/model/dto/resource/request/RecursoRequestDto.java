package br.edu.ifba.park.iot.backend.model.dto.resource.request;

import br.edu.ifba.park.iot.backend.model.enums.TipoVaga;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RecursoRequestDto {

  @NotNull
  private TipoVaga tipo;

  @NotBlank
  private String status;
}