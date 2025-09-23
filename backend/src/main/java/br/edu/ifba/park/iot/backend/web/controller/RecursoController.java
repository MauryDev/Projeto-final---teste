package br.edu.ifba.park.iot.backend.web.controller;

import br.edu.ifba.park.iot.backend.infra.exception.error.ErrorMessage;
import br.edu.ifba.park.iot.backend.model.Recurso;
import br.edu.ifba.park.iot.backend.model.dto.resource.mapper.RecursoMapper;
import br.edu.ifba.park.iot.backend.model.dto.resource.request.RecursoRequestDto;
import br.edu.ifba.park.iot.backend.model.dto.resource.response.RecursoResponseDto;
import br.edu.ifba.park.iot.backend.repository.RecursoRepository;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Recursos", description = "Contém todas as operações para gerenciar vagas de estacionamento.")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/recursos")
public class RecursoController {

  private final RecursoRepository recursoRepository;

  @Operation(summary = "Lista todos os recursos", description = "Retorna uma lista de todas as vagas, com seus respectivos status. Visível para todos os usuários logados.", security = @SecurityRequirement(name = "security"), responses = {
      @ApiResponse(responseCode = "200", description = "Lista de recursos recuperada com sucesso.", content = @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = RecursoResponseDto.class)))),
      @ApiResponse(responseCode = "403", description = "Acesso negado. Token inválido ou ausente.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class)))
  })
  @GetMapping
  public ResponseEntity<List<RecursoResponseDto>> listarTodosOsRecursos() {
    List<Recurso> recursos = recursoRepository.findAll();
    return ResponseEntity.ok(RecursoMapper.toListDto(recursos));
  }

  @Operation(summary = "Recupera um recurso por ID", description = "Retorna um recurso específico. Visível para todos os usuários logados.", security = @SecurityRequirement(name = "security"), responses = {
      @ApiResponse(responseCode = "200", description = "Recurso encontrado com sucesso.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = RecursoResponseDto.class))),
      @ApiResponse(responseCode = "404", description = "Recurso não encontrado.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class))),
      @ApiResponse(responseCode = "403", description = "Acesso negado. Token inválido ou ausente.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class)))
  })
  @GetMapping("/{id}")
  public ResponseEntity<RecursoResponseDto> buscarRecursoPorId(@PathVariable Long id) {
    Recurso recurso = recursoRepository.findById(id).orElse(null);
    if (recurso == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(RecursoMapper.toDto(recurso));
  }

  @Operation(summary = "Cria um novo recurso", description = "Cria uma nova vaga de estacionamento. Acesso restrito a usuários ADMIN.", security = @SecurityRequirement(name = "security"), responses = {
      @ApiResponse(responseCode = "201", description = "Recurso criado com sucesso.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = RecursoResponseDto.class))),
      @ApiResponse(responseCode = "403", description = "Acesso negado. Usuário sem permissão.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class))),
      @ApiResponse(responseCode = "422", description = "Dados de entrada inválidos.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class)))
  })
  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<RecursoResponseDto> criarRecurso(@Valid @RequestBody RecursoRequestDto dto) {
    Recurso recurso = RecursoMapper.toRecurso(dto);
    Recurso novoRecurso = recursoRepository.save(recurso);
    return ResponseEntity.status(HttpStatus.CREATED).body(RecursoMapper.toDto(novoRecurso));
  }

  @Operation(summary = "Atualiza um recurso", description = "Atualiza uma vaga de estacionamento. Acesso restrito a usuários ADMIN.", security = @SecurityRequirement(name = "security"), responses = {
      @ApiResponse(responseCode = "200", description = "Recurso atualizado com sucesso.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = RecursoResponseDto.class))),
      @ApiResponse(responseCode = "404", description = "Recurso não encontrado.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class))),
      @ApiResponse(responseCode = "403", description = "Acesso negado. Usuário sem permissão.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class))),
      @ApiResponse(responseCode = "422", description = "Dados de entrada inválidos.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class)))
  })
  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<RecursoResponseDto> atualizarRecurso(@PathVariable Long id,
      @Valid @RequestBody RecursoRequestDto dto) {
    return recursoRepository.findById(id)
        .map(recurso -> {
          recurso.setNome(dto.getNome());
          recurso.setStatus(dto.getStatus());
          recurso.setTipo(dto.getTipo());
          return ResponseEntity.ok(RecursoMapper.toDto(recursoRepository.save(recurso)));
        })
        .orElse(ResponseEntity.notFound().build());
  }

  @Operation(summary = "Deleta um recurso", description = "Deleta uma vaga de estacionamento. Acesso restrito a usuários ADMIN.", security = @SecurityRequirement(name = "security"), responses = {
      @ApiResponse(responseCode = "204", description = "Recurso deletado com sucesso."),
      @ApiResponse(responseCode = "404", description = "Recurso não encontrado.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class))),
      @ApiResponse(responseCode = "403", description = "Acesso negado. Usuário sem permissão.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class)))
  })
  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> deletarRecurso(@PathVariable Long id) {
    if (recursoRepository.existsById(id)) {
      recursoRepository.deleteById(id);
      return ResponseEntity.noContent().build();
    } else {
      return ResponseEntity.notFound().build();
    }
  }
}