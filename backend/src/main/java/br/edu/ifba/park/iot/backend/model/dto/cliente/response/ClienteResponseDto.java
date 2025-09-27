package br.edu.ifba.park.iot.backend.model.dto.cliente.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClienteResponseDto {

  private Long id;
  private String nome;
  private String cpf;
  private String telefone;
  private String email;
}