package br.edu.ifba.park.iot.backend.web.controller;

import br.edu.ifba.park.iot.backend.infra.exception.error.ErrorMessage;
import br.edu.ifba.park.iot.backend.infra.exception.notfound.EntityNotFoundException;
import br.edu.ifba.park.iot.backend.infra.exception.reserva.ReservaConflictException;
import br.edu.ifba.park.iot.backend.model.Recurso;
import br.edu.ifba.park.iot.backend.model.Reserva;
import br.edu.ifba.park.iot.backend.model.Veiculo;
import br.edu.ifba.park.iot.backend.model.dto.reservation.mapper.ReservaMapper;
import br.edu.ifba.park.iot.backend.model.dto.reservation.request.ReservaRequestDto;
import br.edu.ifba.park.iot.backend.model.dto.reservation.response.ReservaResponseDto;
import br.edu.ifba.park.iot.backend.repository.RecursoRepository;
import br.edu.ifba.park.iot.backend.repository.ReservaRepository;
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
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
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

    private static final Logger logger = LoggerFactory.getLogger(ReservaController.class);

    private final RecursoRepository recursoRepository;
    private final ReservaRepository reservaRepository;
    private final UsuarioRepository usuarioRepository;
    private final VeiculoRepository veiculoRepository;

    @Operation(summary = "Cria uma nova reserva", description = "Cria uma nova reserva para um recurso e associa um veículo.", security = @SecurityRequirement(name = "security"), responses = {
            @ApiResponse(responseCode = "201", description = "Reserva criada com sucesso.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ReservaResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "Recurso não encontrado.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class))),
            @ApiResponse(responseCode = "409", description = "Conflito: recurso não disponível ou usuário já tem uma reserva ativa.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class)))
    })
    @PostMapping
    public ResponseEntity<ReservaResponseDto> reservarRecurso(@RequestBody ReservaRequestDto reservaDto) {
        Authentication autenticacao = SecurityContextHolder.getContext().getAuthentication();
        String nomeUsuarioAtual = autenticacao.getName();
        Optional<Usuario> usuarioOptional = usuarioRepository.findByUsername(nomeUsuarioAtual);

        if (usuarioOptional.isEmpty()) {
            throw new AccessDeniedException("Usuário não autenticado.");
        }
        Usuario usuario = usuarioOptional.get();

        Recurso recurso = recursoRepository.findById(reservaDto.getRecursoId())
                .orElseThrow(() -> new EntityNotFoundException("Recurso não encontrado."));

        logger.debug("Tentando reservar recurso ID={} | Nome={} | Status={}",
                recurso.getId(), recurso.getNome(), recurso.getStatus());

        if (!"available".equals(recurso.getStatus())) {
            throw new ReservaConflictException("Recurso não está disponível.");
        }
        if (reservaRepository.existsByUsuarioAndRecursoAndHorarioFimIsNull(usuario, recurso)) {
            throw new ReservaConflictException("Você já tem uma reserva ativa para este recurso.");
        }

        Veiculo veiculo = veiculoRepository.findByPlaca(reservaDto.getPlacaVeiculo())
                .orElseGet(() -> {
                    Veiculo novoVeiculo = new Veiculo();
                    novoVeiculo.setPlaca(reservaDto.getPlacaVeiculo());
                    novoVeiculo.setMarca(reservaDto.getMarcaVeiculo());
                    novoVeiculo.setModelo(reservaDto.getModeloVeiculo());
                    novoVeiculo.setUsuario(usuario);
                    return veiculoRepository.save(novoVeiculo);
                });

        recurso.setStatus("occupied");
        recursoRepository.save(recurso);

        Reserva reserva = new Reserva();
        reserva.setRecurso(recurso);
        reserva.setUsuario(usuario);
        reserva.setVeiculo(veiculo);
        reserva.setHorarioInicio(LocalDateTime.now());
        reserva.setHorarioFim(null);

        Reserva novaReserva = reservaRepository.save(reserva);
        return ResponseEntity.status(HttpStatus.CREATED).body(ReservaMapper.toDto(novaReserva));
    }

    @Operation(summary = "Finaliza uma reserva", description = "Finaliza a reserva, preenchendo o horário de saída.", security = @SecurityRequirement(name = "security"), responses = {
            @ApiResponse(responseCode = "200", description = "Reserva finalizada com sucesso.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ReservaResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "Reserva não encontrada.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class))),
            @ApiResponse(responseCode = "403", description = "Acesso negado. O usuário não é o dono da reserva.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class)))
    })
    @PutMapping("/finalizar/{reservaId}")
    public ResponseEntity<ReservaResponseDto> finalizarReserva(@PathVariable Long reservaId) {
        Authentication autenticacao = SecurityContextHolder.getContext().getAuthentication();
        String nomeUsuarioAtual = autenticacao.getName();
        Optional<Usuario> usuarioOptional = usuarioRepository.findByUsername(nomeUsuarioAtual);

        if (usuarioOptional.isEmpty()) {
            throw new AccessDeniedException("Usuário não autenticado.");
        }
        Usuario usuario = usuarioOptional.get();

        Reserva reserva = reservaRepository.findById(reservaId)
                .orElseThrow(() -> new EntityNotFoundException("Reserva não encontrada."));

        if (!reserva.getUsuario().equals(usuario)) {
            throw new AccessDeniedException("Você não tem permissão para finalizar esta reserva.");
        }

        reserva.setHorarioFim(LocalDateTime.now());
        reservaRepository.save(reserva);

        reserva.getRecurso().setStatus("available");
        recursoRepository.save(reserva.getRecurso());

        return ResponseEntity.ok(ReservaMapper.toDto(reserva));
    }

    @Operation(summary = "Lista as reservas ativas do usuário logado", description = "Retorna todas as reservas em andamento para o usuário logado.", security = @SecurityRequirement(name = "security"), responses = {
            @ApiResponse(responseCode = "200", description = "Reservas encontradas com sucesso.", content = @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = ReservaResponseDto.class)))),
            @ApiResponse(responseCode = "403", description = "Acesso negado. Token inválido ou ausente.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class)))
    })
    @GetMapping("/ativas")
    public ResponseEntity<List<ReservaResponseDto>> minhasReservasAtivas() {
        Authentication autenticacao = SecurityContextHolder.getContext().getAuthentication();
        String nomeUsuarioAtual = autenticacao.getName();
        Optional<Usuario> usuarioOptional = usuarioRepository.findByUsername(nomeUsuarioAtual);

        if (usuarioOptional.isEmpty()) {
            throw new AccessDeniedException("Usuário não autenticado.");
        }

        List<Reserva> reservasAtivas = reservaRepository.findByUsuarioAndHorarioFimIsNull(usuarioOptional.get());
        return ResponseEntity.ok(ReservaMapper.toListDto(reservasAtivas));
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