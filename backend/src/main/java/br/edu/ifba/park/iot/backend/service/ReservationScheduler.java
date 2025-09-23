package br.edu.ifba.park.iot.backend.service;

import br.edu.ifba.park.iot.backend.model.Reservation;
import br.edu.ifba.park.iot.backend.model.Resource;
import br.edu.ifba.park.iot.backend.repository.ReservationRepository;
import br.edu.ifba.park.iot.backend.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Component
public class ReservationScheduler {

  private final ReservationRepository reservationRepository;
  private final ResourceRepository resourceRepository;

  @Transactional
  @Scheduled(fixedRate = 60000) // Roda a cada 60 segundos
  public void releaseExpiredReservations() {
    log.info("Iniciando a verificação de reservas expiradas...");

    // Encontra todas as reservas cujo 'endTime' já passou
    List<Reservation> expiredReservations = reservationRepository.findByEndTimeBefore(LocalDateTime.now());

    if (expiredReservations.isEmpty()) {
      log.info("Nenhuma reserva expirada encontrada. O agendador está ocioso.");
      return;
    }

    log.info("Foram encontradas {} reservas expiradas. Iniciando a liberação.", expiredReservations.size());

    // Itera sobre as reservas expiradas
    for (Reservation reservation : expiredReservations) {
      Resource resource = reservation.getResource();
      if (resource != null) {
        // Atualiza o status do recurso para "available"
        resource.setStatus("available");
        resourceRepository.save(resource);
        log.info("Recurso com ID {} (Vaga: {}) liberado devido a expiração.", resource.getId(), resource.getName());
      }

      // Deleta a reserva
      reservationRepository.delete(reservation);
    }

    log.info("Verificação de reservas expiradas concluída.");
  }
}