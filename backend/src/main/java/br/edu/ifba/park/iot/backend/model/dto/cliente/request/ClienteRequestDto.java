package br.edu.ifba.park.iot.backend.model.dto.cliente.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.br.CPF;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClienteRequestDto {
  
  @NotBlank
  @Size(min = 5, max = 100)
  private String nome;

  @CPF
  @Size(min = 11, max = 11)
  private String cpf;

  @NotBlank
  @Size(min = 11, max = 15)
  private String telefone;
}
