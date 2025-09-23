package br.edu.ifba.park.iot.backend.model.dto.resource.mapper;

import br.edu.ifba.park.iot.backend.model.Recurso;
import br.edu.ifba.park.iot.backend.model.dto.resource.request.RecursoRequestDto;
import br.edu.ifba.park.iot.backend.model.dto.resource.response.RecursoResponseDto;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.stream.Collectors;

public class RecursoMapper {

  public static Recurso toRecurso(RecursoRequestDto dto) {
    return new ModelMapper().map(dto, Recurso.class);
  }

  public static RecursoResponseDto toDto(Recurso recurso) {
    return new ModelMapper().map(recurso, RecursoResponseDto.class);
  }

  public static List<RecursoResponseDto> toListDto(List<Recurso> recursos) {
    return recursos.stream()
        .map(recurso -> toDto(recurso))
        .collect(Collectors.toList());
  }
}