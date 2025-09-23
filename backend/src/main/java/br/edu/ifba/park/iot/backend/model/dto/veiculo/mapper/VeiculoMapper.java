package br.edu.ifba.park.iot.backend.model.dto.veiculo.mapper;

import br.edu.ifba.park.iot.backend.model.Veiculo;
import br.edu.ifba.park.iot.backend.model.dto.veiculo.request.VeiculoRequestDto;
import br.edu.ifba.park.iot.backend.model.dto.veiculo.response.VeiculoResponseDto;
import br.edu.ifba.park.iot.backend.security.model.Usuario;

import java.util.List;
import java.util.stream.Collectors;

public class VeiculoMapper {

  public static Veiculo toVeiculo(VeiculoRequestDto dto, Usuario usuario) {
    Veiculo veiculo = new Veiculo();
    veiculo.setPlaca(dto.getPlaca());
    veiculo.setMarca(dto.getMarca());
    veiculo.setModelo(dto.getModelo());
    veiculo.setUsuario(usuario);
    return veiculo;
  }

  public static VeiculoResponseDto toDto(Veiculo veiculo) {
    return new VeiculoResponseDto(
        veiculo.getId(),
        veiculo.getPlaca(),
        veiculo.getMarca(),
        veiculo.getModelo(),
        veiculo.getUsuario().getId());
  }

  public static List<VeiculoResponseDto> toListDto(List<Veiculo> veiculos) {
    return veiculos.stream()
        .map(VeiculoMapper::toDto)
        .collect(Collectors.toList());
  }
}