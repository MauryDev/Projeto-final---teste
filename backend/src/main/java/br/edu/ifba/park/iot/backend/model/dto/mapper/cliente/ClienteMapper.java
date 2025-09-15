package br.edu.ifba.park.iot.backend.model.dto.mapper.cliente;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.modelmapper.ModelMapper;

import br.edu.ifba.park.iot.backend.model.Cliente;
import br.edu.ifba.park.iot.backend.model.dto.cliente.request.ClienteRequestDto;
import br.edu.ifba.park.iot.backend.model.dto.cliente.response.ClienteResponseDto;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ClienteMapper {

  public static Cliente toCliente(ClienteRequestDto dto) {
    return new ModelMapper().map(dto, Cliente.class);
  }

  public static ClienteResponseDto toDto(Cliente cliente) {
    return new ModelMapper().map(cliente, ClienteResponseDto.class);
  }
}