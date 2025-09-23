package br.edu.ifba.park.iot.backend.model.dto.resource.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ResourceRequestDto {
  @NotBlank
  private String name;

  @NotBlank
  private String status;

  @NotBlank
  private String type;
}