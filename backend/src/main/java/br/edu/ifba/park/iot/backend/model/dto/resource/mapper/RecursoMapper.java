package br.edu.ifba.park.iot.backend.model.dto.resource.mapper;

import br.edu.ifba.park.iot.backend.model.Recurso;
import br.edu.ifba.park.iot.backend.model.dto.resource.request.RecursoRequestDto;
import br.edu.ifba.park.iot.backend.model.dto.resource.response.RecursoResponseDto;

import java.util.List;
import java.util.stream.Collectors;

public class RecursoMapper {

  public static Recurso toRecurso(RecursoRequestDto dto) {
    Recurso recurso = new Recurso();
    recurso.setTipo(dto.getTipo());
    return recurso;
  }

  public static RecursoResponseDto toDto(Recurso recurso) {
    RecursoResponseDto dto = new RecursoResponseDto();
    dto.setId(recurso.getId());
    dto.setNumeroVaga(recurso.getNumeroVaga());
    dto.setNome(recurso.getNome());
    dto.setStatus(recurso.getStatus());
    dto.setTipo(recurso.getTipo().name());
    return dto;
  }

  public static List<RecursoResponseDto> toListDto(List<Recurso> recursos) {
    return recursos.stream()
        .map(RecursoMapper::toDto)
        .collect(Collectors.toList());
  }
}