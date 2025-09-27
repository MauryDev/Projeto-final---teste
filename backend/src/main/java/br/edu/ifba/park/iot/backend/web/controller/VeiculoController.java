package br.edu.ifba.park.iot.backend.web.controller;

import br.edu.ifba.park.iot.backend.infra.exception.error.ErrorMessage;
import br.edu.ifba.park.iot.backend.model.Veiculo;
import br.edu.ifba.park.iot.backend.model.dto.veiculo.mapper.VeiculoMapper;
import br.edu.ifba.park.iot.backend.model.dto.veiculo.request.VeiculoRequestDto;
import br.edu.ifba.park.iot.backend.model.dto.veiculo.response.VeiculoResponseDto;
import br.edu.ifba.park.iot.backend.repository.VeiculoRepository;
import br.edu.ifba.park.iot.backend.security.model.Usuario;
import br.edu.ifba.park.iot.backend.security.repository.UsuarioRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Tag(name = "Veículos", description = "Contém todas as operações para gerenciar os veículos dos usuários.")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/veiculos")
public class VeiculoController {

  private final VeiculoRepository veiculoRepository;
  private final UsuarioRepository usuarioRepository;

  @Operation(summary = "Lista todos os veículos do usuário logado", description = "Retorna uma lista de todos os veículos pertencentes ao usuário que está logado.", security = @SecurityRequirement(name = "security"), responses = {
      @ApiResponse(responseCode = "200", description = "Lista de veículos recuperada com sucesso.", content = @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = VeiculoResponseDto.class)))),
      @ApiResponse(responseCode = "403", description = "Acesso negado. Token inválido ou ausente.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class)))
  })
  @GetMapping
  public ResponseEntity<List<VeiculoResponseDto>> listarVeiculosDoUsuario() {
    Authentication autenticacao = SecurityContextHolder.getContext().getAuthentication();
    String nomeUsuarioAtual = autenticacao.getName();
    Optional<Usuario> usuarioOptional = usuarioRepository.findByUsername(nomeUsuarioAtual);

    if (usuarioOptional.isEmpty()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    List<Veiculo> veiculos = veiculoRepository.findByUsuario(usuarioOptional.get());
    return ResponseEntity.ok(VeiculoMapper.toListDto(veiculos));
  }

  @Operation(summary = "Cria um novo veículo", description = "Cria um novo veículo para o usuário logado.", security = @SecurityRequirement(name = "security"), responses = {
      @ApiResponse(responseCode = "201", description = "Veículo criado com sucesso.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = VeiculoResponseDto.class))),
      @ApiResponse(responseCode = "409", description = "Conflito: Já existe um veículo com esta placa.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class))),
      @ApiResponse(responseCode = "422", description = "Dados de entrada inválidos.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class)))
  })
  @PostMapping
  public ResponseEntity<VeiculoResponseDto> criarVeiculo(@Valid @RequestBody VeiculoRequestDto dto) {
    Authentication autenticacao = SecurityContextHolder.getContext().getAuthentication();
    String nomeUsuarioAtual = autenticacao.getName();
    Optional<Usuario> usuarioOptional = usuarioRepository.findByUsername(nomeUsuarioAtual);

    if (usuarioOptional.isEmpty()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    // Verifica se já existe um veículo com a mesma placa
    if (veiculoRepository.findByPlaca(dto.getPlaca()).isPresent()) {
      return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
    }

    Veiculo veiculo = VeiculoMapper.toVeiculo(dto, usuarioOptional.get());
    Veiculo novoVeiculo = veiculoRepository.save(veiculo);
    return ResponseEntity.status(HttpStatus.CREATED).body(VeiculoMapper.toDto(novoVeiculo));
  }

  @Operation(summary = "Atualiza um veículo por ID", description = "Atualiza os dados de um veículo do usuário logado. Só o dono pode fazer a atualização.", security = @SecurityRequirement(name = "security"), responses = {
      @ApiResponse(responseCode = "200", description = "Veículo atualizado com sucesso.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = VeiculoResponseDto.class))),
      @ApiResponse(responseCode = "404", description = "Veículo não encontrado ou não pertence ao usuário.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class))),
      @ApiResponse(responseCode = "422", description = "Dados de entrada inválidos.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class)))
  })
  @PutMapping("/{id}")
  public ResponseEntity<VeiculoResponseDto> atualizarVeiculo(@PathVariable Long id,
      @Valid @RequestBody VeiculoRequestDto dto) {
    Authentication autenticacao = SecurityContextHolder.getContext().getAuthentication();
    String nomeUsuarioAtual = autenticacao.getName();
    Optional<Usuario> usuarioOptional = usuarioRepository.findByUsername(nomeUsuarioAtual);

    if (usuarioOptional.isEmpty()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    Optional<Veiculo> veiculoOptional = veiculoRepository.findByIdAndUsuario(id, usuarioOptional.get());

    if (veiculoOptional.isPresent()) {
      Veiculo veiculo = veiculoOptional.get();

      // Verifica se a placa foi alterada e se a nova placa já existe
      if (!veiculo.getPlaca().equals(dto.getPlaca())) {
        if (veiculoRepository.findByPlaca(dto.getPlaca()).isPresent()) {
          return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
      }

      veiculo.setPlaca(dto.getPlaca());
      veiculo.setMarca(dto.getMarca());
      veiculo.setModelo(dto.getModelo());

      Veiculo veiculoAtualizado = veiculoRepository.save(veiculo);
      return ResponseEntity.ok(VeiculoMapper.toDto(veiculoAtualizado));
    } else {
      return ResponseEntity.notFound().build();
    }
  }

  @Operation(summary = "Deleta um veículo por ID", description = "Deleta um veículo do usuário logado. Só o dono pode deletar.", security = @SecurityRequirement(name = "security"), responses = {
      @ApiResponse(responseCode = "204", description = "Veículo deletado com sucesso."),
      @ApiResponse(responseCode = "404", description = "Veículo não encontrado ou não pertence ao usuário.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class)))
  })
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deletarVeiculo(@PathVariable Long id) {
    Authentication autenticacao = SecurityContextHolder.getContext().getAuthentication();
    String nomeUsuarioAtual = autenticacao.getName();
    Optional<Usuario> usuarioOptional = usuarioRepository.findByUsername(nomeUsuarioAtual);

    if (usuarioOptional.isEmpty()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    Optional<Veiculo> veiculoOptional = veiculoRepository.findByIdAndUsuario(id, usuarioOptional.get());
    if (veiculoOptional.isPresent()) {
      veiculoRepository.delete(veiculoOptional.get());
      return ResponseEntity.noContent().build();
    } else {
      return ResponseEntity.notFound().build();
    }
  }
}