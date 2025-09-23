package br.edu.ifba.park.iot.backend.model.dto.reservation.mapper;

import br.edu.ifba.park.iot.backend.model.Reservation;
import br.edu.ifba.park.iot.backend.model.dto.reservation.response.ReservationResponseDto;

import java.util.List;
import java.util.stream.Collectors;

public class ReservationMapper {

  public static ReservationResponseDto toDto(Reservation reservation) {
    ReservationResponseDto dto = new ReservationResponseDto();
    dto.setId(reservation.getId());
    dto.setResourceId(reservation.getResource().getId());
    dto.setResourceName(reservation.getResource().getName());
    dto.setUserId(reservation.getUser().getId());
    dto.setUserName(reservation.getUser().getUsername());
    dto.setStartTime(reservation.getStartTime());
    dto.setEndTime(reservation.getEndTime());
    return dto;
  }

  public static List<ReservationResponseDto> toListDto(List<Reservation> reservations) {
    return reservations.stream()
        .map(ReservationMapper::toDto)
        .collect(Collectors.toList());
  }
}