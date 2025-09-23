package br.edu.ifba.park.iot.backend.model.dto.veiculo.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VeiculoRequestDto {

  @NotBlank(message = "A placa é obrigatória.")
  @Size(min = 7, max = 7, message = "A placa deve ter 7 caracteres.")
  private String placa;

  @NotBlank(message = "A marca é obrigatória.")
  private String marca;

  @NotBlank(message = "O modelo é obrigatório.")
  private String modelo;
}