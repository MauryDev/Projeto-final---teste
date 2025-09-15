package br.edu.ifba.park.iot.backend.security.model.dto.mapper.usuario;

import br.edu.ifba.park.iot.backend.security.model.Usuario;
import br.edu.ifba.park.iot.backend.security.model.dto.usuario.request.UsuarioRequestDto;
import br.edu.ifba.park.iot.backend.security.model.dto.usuario.response.UsuarioResponseDto;

import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;

import java.util.List;
import java.util.stream.Collectors;

public class UsuarioMapper {

  public static Usuario toUsuario(UsuarioRequestDto createDto) {
    return new ModelMapper().map(createDto, Usuario.class);
  }

  public static UsuarioResponseDto toDto(Usuario usuario) {
    String role = usuario.getRole().name().substring("ROLE_".length());
    PropertyMap<Usuario, UsuarioResponseDto> props = new PropertyMap<Usuario, UsuarioResponseDto>() {
      @Override
      protected void configure() {
        map().setRole(role);
      }
    };
    ModelMapper mapper = new ModelMapper();
    mapper.addMappings(props);
    return mapper.map(usuario, UsuarioResponseDto.class);
  }

  public static List<UsuarioResponseDto> toListDto(List<Usuario> usuarios) {
    return usuarios.stream().map(user -> toDto(user)).collect(Collectors.toList());
  }

}
