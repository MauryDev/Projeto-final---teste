package br.edu.ifba.park.iot.backend.model.dto.reservation.mapper;

import br.edu.ifba.park.iot.backend.model.Reserva;
import br.edu.ifba.park.iot.backend.model.dto.reservation.response.ReservaResponseDto;

import java.util.List;
import java.util.stream.Collectors;

public class ReservaMapper {

    // Método para converter uma entidade de Reserva em um DTO de resposta
    public static ReservaResponseDto toDto(Reserva reserva) {
        if (reserva == null) {
            return null;
        }

        ReservaResponseDto dto = new ReservaResponseDto();
        dto.setId(reserva.getId());
        dto.setRecursoId(reserva.getRecurso().getId());
        dto.setNomeRecurso(reserva.getRecurso().getNome());
        dto.setTipoVaga(reserva.getRecurso().getTipo().name());
        dto.setUsuarioId(reserva.getUsuario().getId());
        dto.setNomeUsuario(reserva.getUsuario().getUsername());
        dto.setPlacaVeiculo(reserva.getVeiculo().getPlaca());
        dto.setMarcaVeiculo(reserva.getVeiculo().getMarca());
        dto.setModeloVeiculo(reserva.getVeiculo().getModelo());
        dto.setHorarioInicio(reserva.getHorarioInicio());
        dto.setHorarioFim(reserva.getHorarioFim());
        
        // ✨ Adicionando o status do recurso ao DTO
        dto.setStatusRecurso(reserva.getRecurso().getStatus());

        return dto;
    }

    // Método para converter uma lista de entidades de Reserva em uma lista de DTOs de resposta
    public static List<ReservaResponseDto> toListDto(List<Reserva> reservas) {
        return reservas.stream()
                .map(ReservaMapper::toDto)
                .collect(Collectors.toList());
    }
}