package br.edu.ifba.park.iot.backend.model.dto.cliente.mapper;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.modelmapper.ModelMapper;

import br.edu.ifba.park.iot.backend.model.Cliente;
import br.edu.ifba.park.iot.backend.model.dto.cliente.request.ClienteRequestDto;
import br.edu.ifba.park.iot.backend.model.dto.cliente.response.ClienteResponseDto;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ClienteMapper {

  private static final ModelMapper modelMapper = new ModelMapper();

  static {
    modelMapper.typeMap(Cliente.class, ClienteResponseDto.class)
        .addMapping(src -> src.getUsuario().getUsername(), ClienteResponseDto::setEmail);
  }

  public static Cliente toCliente(ClienteRequestDto dto) {
    return modelMapper.map(dto, Cliente.class);
  }

  public static ClienteResponseDto toDto(Cliente cliente) {
    return modelMapper.map(cliente, ClienteResponseDto.class);
  }

}