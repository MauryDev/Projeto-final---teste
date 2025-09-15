package br.edu.ifba.park.iot.backend.security.web.controller;

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
import br.edu.ifba.park.iot.backend.security.model.Usuario;
import br.edu.ifba.park.iot.backend.security.model.dto.mapper.usuario.UsuarioMapper;
import br.edu.ifba.park.iot.backend.security.model.dto.usuario.request.UsuarioRequestDto;
import br.edu.ifba.park.iot.backend.security.model.dto.usuario.request.UsuarioSenhaRequestDto;
import br.edu.ifba.park.iot.backend.security.model.dto.usuario.response.UsuarioResponseDto;
import br.edu.ifba.park.iot.backend.security.service.UsuarioService;

import java.util.List;

@Tag(name = "Usuarios", description = "Contém todas as operações aos recursos para cadastro, edição e leitura de um usuário.")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioController {

  private final UsuarioService usuarioService;

  @Operation(summary = "Cria um novo usuário", description = "Recurso para criar um novo usuário no sistema.", responses = {
      @ApiResponse(responseCode = "201", description = "Usuário criado com sucesso.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = UsuarioResponseDto.class))),
      @ApiResponse(responseCode = "409", description = "Usuário e-mail já cadastrado no sistema.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class))),
      @ApiResponse(responseCode = "422", description = "Recursos não processados por dados de entrada invalidos.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class))),
  })
  @PostMapping
  public ResponseEntity<UsuarioResponseDto> create(@Valid @RequestBody UsuarioRequestDto createDto) {
    Usuario user = usuarioService.salvar(UsuarioMapper.toUsuario(createDto));
    return ResponseEntity.status(HttpStatus.CREATED).body(UsuarioMapper.toDto(user));
  }

  @Operation(summary = "Listar todos os usuarios cadastratos", description = "Requisição exige um Bearer Token. Acesso restrito a ADMIN logado", security = @SecurityRequirement(name = "security"), responses = {
      @ApiResponse(responseCode = "200", description = "Lista com todos os usuarios cadastrados", content = @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = UsuarioResponseDto.class)))),
      @ApiResponse(responseCode = "403", description = "Usuário sem permissão para acessar esse recurso.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class))),
  })
  @GetMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<List<UsuarioResponseDto>> getAll() {
    List<Usuario> users = usuarioService.buscaTodos();
    return ResponseEntity.ok(UsuarioMapper.toListDto(users));
  }

  @Operation(summary = "Recuperar um usuário pelo id", description = "Requisição exige um Bearer Token. Acesso restrito a ADMIN | CLIENTE", security = @SecurityRequirement(name = "security"), responses = {
      @ApiResponse(responseCode = "200", description = "Recurso recuperado com sucesso.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = UsuarioResponseDto.class))),
      @ApiResponse(responseCode = "404", description = "Recurso não encontrado.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class))),
      @ApiResponse(responseCode = "403", description = "Usuário sem permissão para acessar esse recurso.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class)))
  })
  @GetMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN') OR ( hasRole('CLIENTE') AND #id == authentication.principal.id )")
  public ResponseEntity<UsuarioResponseDto> getById(@PathVariable Long id) {
    Usuario user = usuarioService.buscarPorId(id);
    return ResponseEntity.ok(UsuarioMapper.toDto(user));
  }

  @Operation(summary = "Atualizar senha", description = "Requisição exige um Bearer Token. Acesso restrito a ADMIN | CLIENTE", security = @SecurityRequirement(name = "security"), responses = {
      @ApiResponse(responseCode = "204", description = "Senha atualizada com sucesso."),
      @ApiResponse(responseCode = "400", description = "Senha não confere.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class))),
      @ApiResponse(responseCode = "422", description = "Campos invalidos ou formatados incorretamente.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class))),
      @ApiResponse(responseCode = "403", description = "Usuário sem permissão para acessar esse recurso.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class)))
  })
  @PatchMapping("/{id}")
  @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE') AND (#id == authentication.principal.id)")
  public ResponseEntity<Void> updatePassword(@PathVariable Long id, @Valid @RequestBody UsuarioSenhaRequestDto dto) {
    usuarioService.editarSenha(id, dto.getSenhaAtual(), dto.getNovaSenha(), dto.getConfirmaSenha());
    return ResponseEntity.noContent().build();
  }
}
