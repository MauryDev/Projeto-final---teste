package br.edu.ifba.park.iot.backend.web.controller;

import br.edu.ifba.park.iot.backend.infra.exception.error.ErrorMessage;
import br.edu.ifba.park.iot.backend.model.Recurso;
import br.edu.ifba.park.iot.backend.model.Reserva;
import br.edu.ifba.park.iot.backend.model.dto.reservation.mapper.ReservaMapper;
import br.edu.ifba.park.iot.backend.model.dto.reservation.response.ReservaResponseDto;
import br.edu.ifba.park.iot.backend.repository.RecursoRepository;
import br.edu.ifba.park.iot.backend.repository.ReservaRepository;
import br.edu.ifba.park.iot.backend.security.model.Usuario;
import br.edu.ifba.park.iot.backend.security.repository.UsuarioRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Tag(name = "Reservas", description = "Contém todas as operações para gerenciar as reservas de recursos.")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/reservas")
public class ReservaController {

    private final RecursoRepository recursoRepository;
    private final ReservaRepository reservaRepository;
    private final UsuarioRepository usuarioRepository;

    @Operation(summary = "Cria uma nova reserva", description = "Cria uma nova reserva para um recurso específico. O recurso deve estar 'available' e o usuário não pode ter outra reserva ativa no mesmo recurso.", security = @SecurityRequirement(name = "security"), responses = {
            @ApiResponse(responseCode = "201", description = "Reserva criada com sucesso.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ReservaResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "Recurso não encontrado.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class))),
            @ApiResponse(responseCode = "409", description = "Conflito: recurso não disponível ou usuário já tem uma reserva ativa.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class))),
            @ApiResponse(responseCode = "403", description = "Acesso negado. Token inválido ou ausente.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class)))
    })
    @PostMapping("/reservar/{recursoId}")
    public ResponseEntity<ReservaResponseDto> reservarRecurso(@PathVariable Long recursoId) {
        Authentication autenticacao = SecurityContextHolder.getContext().getAuthentication();
        String nomeUsuarioAtual = autenticacao.getName();
        Optional<Usuario> usuarioOptional = usuarioRepository.findByUsername(nomeUsuarioAtual);

        if (usuarioOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Recurso recurso = recursoRepository.findById(recursoId).orElse(null);
        if (recurso == null) {
            return ResponseEntity.notFound().build();
        }

        if ("available".equals(recurso.getStatus())) {
            // Verifica se o usuário já tem uma reserva para este recurso.
            if (reservaRepository.existsByUsuarioAndRecurso(usuarioOptional.get(), recurso)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
            }

            recurso.setStatus("reserved");
            recursoRepository.save(recurso);

            Reserva reserva = new Reserva();
            reserva.setRecurso(recurso);
            reserva.setUsuario(usuarioOptional.get());
            reserva.setHorarioInicio(LocalDateTime.now());
            // Define o tempo de expiração para o timeout (ex: 30 minutos)
            reserva.setHorarioFim(LocalDateTime.now().plusMinutes(30));

            Reserva novaReserva = reservaRepository.save(reserva);
            return ResponseEntity.status(HttpStatus.CREATED).body(ReservaMapper.toDto(novaReserva));
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
    }

    @Operation(summary = "Libera um recurso", description = "Libera manualmente a reserva de um recurso. Só pode ser feita pelo usuário que a criou.", security = @SecurityRequirement(name = "security"), responses = {
            @ApiResponse(responseCode = "204", description = "Recurso liberado com sucesso."),
            @ApiResponse(responseCode = "404", description = "Recurso ou reserva não encontrados.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class))),
            @ApiResponse(responseCode = "403", description = "Acesso negado. O usuário não é o dono da reserva.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class)))
    })
    @PostMapping("/liberar/{recursoId}")
    public ResponseEntity<Void> liberarRecurso(@PathVariable Long recursoId) {
        Authentication autenticacao = SecurityContextHolder.getContext().getAuthentication();
        String nomeUsuarioAtual = autenticacao.getName();

        Optional<Usuario> usuarioOptional = usuarioRepository.findByUsername(nomeUsuarioAtual);
        Optional<Recurso> recursoOptional = recursoRepository.findById(recursoId);

        if (usuarioOptional.isEmpty() || recursoOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Usuario usuarioAtual = usuarioOptional.get();
        Recurso recurso = recursoOptional.get();

        Optional<Reserva> reservaOptional = reservaRepository.findByUsuarioAndRecurso(usuarioAtual, recurso);

        if (reservaOptional.isPresent()) {
            recurso.setStatus("available");
            recursoRepository.save(recurso);
            reservaRepository.delete(reservaOptional.get());
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @Operation(summary = "Lista as reservas do usuário logado", description = "Retorna todas as reservas ativas ou históricas do usuário que está logado.", security = @SecurityRequirement(name = "security"), responses = {
            @ApiResponse(responseCode = "200", description = "Reservas encontradas com sucesso.", content = @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = ReservaResponseDto.class)))),
            @ApiResponse(responseCode = "403", description = "Acesso negado. Token inválido ou ausente.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class)))
    })
    @GetMapping("/minhas-reservas")
    public ResponseEntity<List<ReservaResponseDto>> minhasReservas() {
        Authentication autenticacao = SecurityContextHolder.getContext().getAuthentication();
        String nomeUsuarioAtual = autenticacao.getName();
        Optional<Usuario> usuarioOptional = usuarioRepository.findByUsername(nomeUsuarioAtual);

        if (usuarioOptional.isPresent()) {
            List<Reserva> reservas = reservaRepository.findByUsuario(usuarioOptional.get());
            return ResponseEntity.ok(ReservaMapper.toListDto(reservas));
        }
        return ResponseEntity.ok(List.of());
    }
}