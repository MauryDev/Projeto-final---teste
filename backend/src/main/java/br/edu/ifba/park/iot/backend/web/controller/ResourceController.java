package br.edu.ifba.park.iot.backend.web.controller;

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

import br.edu.ifba.park.iot.backend.infra.exception.error.ErrorMessage;
import br.edu.ifba.park.iot.backend.model.Resource;
import br.edu.ifba.park.iot.backend.model.dto.resource.mapper.ResourceMapper;
import br.edu.ifba.park.iot.backend.model.dto.resource.request.ResourceRequestDto;
import br.edu.ifba.park.iot.backend.model.dto.resource.response.ResourceResponseDto;
import br.edu.ifba.park.iot.backend.repository.ResourceRepository;

import java.util.List;

@Tag(name = "Recursos", description = "Contém todas as operações para gerenciar vagas de estacionamento.")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/resources")
public class ResourceController {

  private final ResourceRepository resourceRepository;

  @Operation(summary = "Lista todos os recursos", description = "Retorna uma lista de todas as vagas, com seus respectivos status. Visível para todos os usuários logados.", security = @SecurityRequirement(name = "security"), responses = {
      @ApiResponse(responseCode = "200", description = "Lista de recursos recuperada com sucesso.", content = @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = ResourceResponseDto.class)))),
      @ApiResponse(responseCode = "403", description = "Acesso negado. Token inválido ou ausente.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class)))
  })
  @GetMapping
  public ResponseEntity<List<ResourceResponseDto>> getAllResources() {
    List<Resource> resources = resourceRepository.findAll();
    return ResponseEntity.ok(ResourceMapper.toListDto(resources));
  }

  @Operation(summary = "Recupera um recurso por ID", description = "Retorna um recurso específico. Visível para todos os usuários logados.", security = @SecurityRequirement(name = "security"), responses = {
      @ApiResponse(responseCode = "200", description = "Recurso encontrado com sucesso.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ResourceResponseDto.class))),
      @ApiResponse(responseCode = "404", description = "Recurso não encontrado.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class))),
      @ApiResponse(responseCode = "403", description = "Acesso negado. Token inválido ou ausente.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class)))
  })
  @GetMapping("/{id}")
  public ResponseEntity<ResourceResponseDto> getResourceById(@PathVariable Long id) {
    Resource resource = resourceRepository.findById(id).orElse(null);
    if (resource == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(ResourceMapper.toDto(resource));
  }

  @Operation(summary = "Cria um novo recurso", description = "Cria uma nova vaga de estacionamento. Acesso restrito a usuários ADMIN.", security = @SecurityRequirement(name = "security"), responses = {
      @ApiResponse(responseCode = "201", description = "Recurso criado com sucesso.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ResourceResponseDto.class))),
      @ApiResponse(responseCode = "403", description = "Acesso negado. Usuário sem permissão.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class))),
      @ApiResponse(responseCode = "422", description = "Dados de entrada inválidos.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class)))
  })
  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ResourceResponseDto> createResource(@Valid @RequestBody ResourceRequestDto dto) {
    Resource resource = ResourceMapper.toResource(dto);
    Resource newResource = resourceRepository.save(resource);
    return ResponseEntity.status(HttpStatus.CREATED).body(ResourceMapper.toDto(newResource));
  }

  @Operation(summary = "Atualiza um recurso", description = "Atualiza uma vaga de estacionamento. Acesso restrito a usuários ADMIN.", security = @SecurityRequirement(name = "security"), responses = {
      @ApiResponse(responseCode = "200", description = "Recurso atualizado com sucesso.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ResourceResponseDto.class))),
      @ApiResponse(responseCode = "404", description = "Recurso não encontrado.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class))),
      @ApiResponse(responseCode = "403", description = "Acesso negado. Usuário sem permissão.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class))),
      @ApiResponse(responseCode = "422", description = "Dados de entrada inválidos.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class)))
  })
  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ResourceResponseDto> updateResource(@PathVariable Long id,
      @Valid @RequestBody ResourceRequestDto dto) {
    return resourceRepository.findById(id)
        .map(resource -> {
          resource.setName(dto.getName());
          resource.setStatus(dto.getStatus());
          resource.setType(dto.getType());
          return ResponseEntity.ok(ResourceMapper.toDto(resourceRepository.save(resource)));
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
  public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
    if (resourceRepository.existsById(id)) {
      resourceRepository.deleteById(id);
      return ResponseEntity.noContent().build();
    } else {
      return ResponseEntity.notFound().build();
    }
  }
}