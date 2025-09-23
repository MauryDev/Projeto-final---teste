package br.edu.ifba.park.iot.backend.web.controller;

import br.edu.ifba.park.iot.backend.infra.exception.error.ErrorMessage;
import br.edu.ifba.park.iot.backend.model.Resource;
import br.edu.ifba.park.iot.backend.model.Reservation;
import br.edu.ifba.park.iot.backend.model.dto.reservation.mapper.ReservationMapper;
import br.edu.ifba.park.iot.backend.model.dto.reservation.response.ReservationResponseDto;
import br.edu.ifba.park.iot.backend.repository.ResourceRepository;
import br.edu.ifba.park.iot.backend.repository.ReservationRepository;
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
@RequestMapping("/api/v1/reservations")
public class ReservationController {

    private final ResourceRepository resourceRepository;
    private final ReservationRepository reservationRepository;
    private final UsuarioRepository usuarioRepository;

    @Operation(summary = "Cria uma nova reserva", description = "Cria uma nova reserva para um recurso específico. O recurso deve estar 'available' e o usuário não pode ter outra reserva ativa no mesmo recurso.", security = @SecurityRequirement(name = "security"), responses = {
            @ApiResponse(responseCode = "201", description = "Reserva criada com sucesso.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ReservationResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "Recurso não encontrado.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class))),
            @ApiResponse(responseCode = "409", description = "Conflito: recurso não disponível ou usuário já tem uma reserva ativa.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class))),
            @ApiResponse(responseCode = "403", description = "Acesso negado. Token inválido ou ausente.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class)))
    })
    @PostMapping("/reserve/{resourceId}")
    public ResponseEntity<ReservationResponseDto> reserveResource(@PathVariable Long resourceId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        Optional<Usuario> userOptional = usuarioRepository.findByUsername(currentUsername);

        if (!userOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Resource resource = resourceRepository.findById(resourceId).orElse(null);
        if (resource == null) {
            return ResponseEntity.notFound().build();
        }

        if ("available".equals(resource.getStatus())) {
            // Verifica se o usuário já tem uma reserva para este recurso.
            if (reservationRepository.existsByUserAndResource(userOptional.get(), resource)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
            }

            resource.setStatus("reserved");
            resourceRepository.save(resource);

            Reservation reservation = new Reservation();
            reservation.setResource(resource);
            reservation.setUser(userOptional.get());
            reservation.setStartTime(LocalDateTime.now());
            // Define o tempo de expiração para o timeout (ex: 30 minutos)
            reservation.setEndTime(LocalDateTime.now().plusMinutes(30));

            Reservation newReservation = reservationRepository.save(reservation);
            return ResponseEntity.status(HttpStatus.CREATED).body(ReservationMapper.toDto(newReservation));
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
    }

    @Operation(summary = "Libera um recurso", description = "Libera manualmente a reserva de um recurso. Só pode ser feita pelo usuário que a criou.", security = @SecurityRequirement(name = "security"), responses = {
            @ApiResponse(responseCode = "204", description = "Recurso liberado com sucesso."),
            @ApiResponse(responseCode = "404", description = "Recurso ou reserva não encontrados.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class))),
            @ApiResponse(responseCode = "403", description = "Acesso negado. O usuário não é o dono da reserva.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class)))
    })
    @PostMapping("/release/{resourceId}")
    public ResponseEntity<Void> releaseResource(@PathVariable Long resourceId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        Optional<Usuario> userOptional = usuarioRepository.findByUsername(currentUsername);
        Optional<Resource> resourceOptional = resourceRepository.findById(resourceId);
        
        if (!userOptional.isPresent() || !resourceOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        Usuario currentUser = userOptional.get();
        Resource resource = resourceOptional.get();

        Optional<Reservation> reservationOptional = reservationRepository.findByUserAndResource(currentUser, resource);
        
        if (reservationOptional.isPresent()) {
            resource.setStatus("available");
            resourceRepository.save(resource);
            reservationRepository.delete(reservationOptional.get());
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @Operation(summary = "Lista as reservas do usuário logado", description = "Retorna todas as reservas ativas ou históricas do usuário que está logado.", security = @SecurityRequirement(name = "security"), responses = {
            @ApiResponse(responseCode = "200", description = "Reservas encontradas com sucesso.", content = @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = ReservationResponseDto.class)))),
            @ApiResponse(responseCode = "403", description = "Acesso negado. Token inválido ou ausente.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorMessage.class)))
    })
    @GetMapping("/my-reservations")
    public ResponseEntity<List<ReservationResponseDto>> getMyReservations() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        Optional<Usuario> userOptional = usuarioRepository.findByUsername(currentUsername);

        if (userOptional.isPresent()) {
            List<Reservation> reservations = reservationRepository.findByUser(userOptional.get());
            return ResponseEntity.ok(ReservationMapper.toListDto(reservations));
        }
        return ResponseEntity.ok(List.of());
    }
}