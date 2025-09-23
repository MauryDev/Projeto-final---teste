package br.edu.ifba.park.iot.backend.model.dto.reservation.mapper;

import br.edu.ifba.park.iot.backend.model.Reserva;
import br.edu.ifba.park.iot.backend.model.dto.reservation.response.ReservaResponseDto;

import java.util.List;
import java.util.stream.Collectors;

public class ReservaMapper {

  public static ReservaResponseDto toDto(Reserva reserva) {
    ReservaResponseDto dto = new ReservaResponseDto();
    dto.setId(reserva.getId());
    dto.setRecursoId(reserva.getRecurso().getId());
    dto.setNomeRecurso(reserva.getRecurso().getNome());
    dto.setUsuarioId(reserva.getUsuario().getId());
    dto.setNomeUsuario(reserva.getUsuario().getUsername());
    dto.setHorarioInicio(reserva.getHorarioInicio());
    dto.setHorarioFim(reserva.getHorarioFim());
    return dto;
  }

  public static List<ReservaResponseDto> toListDto(List<Reserva> reservas) {
    return reservas.stream()
        .map(ReservaMapper::toDto)
        .collect(Collectors.toList());
  }
}