package br.edu.ifba.park.iot.backend.service;

import br.edu.ifba.park.iot.backend.model.Reserva;
import br.edu.ifba.park.iot.backend.model.Recurso;
import br.edu.ifba.park.iot.backend.repository.ReservaRepository;
import br.edu.ifba.park.iot.backend.repository.RecursoRepository;
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
public class AgendadorDeReservas {

  private final ReservaRepository reservaRepository;
  private final RecursoRepository recursoRepository;

  // Tolerância de 15 minutos (900 segundos)
  private static final int TOLERANCIA_MINUTOS = 15;

  @Transactional
  @Scheduled(fixedRate = 60000) // Roda a cada 60 segundos
  public void liberarReservasExpiradas() {
    log.info("Iniciando a verificação de reservas expiradas...");

    LocalDateTime limite = LocalDateTime.now().minusMinutes(TOLERANCIA_MINUTOS);

    // Encontra todas as reservas cujo 'horarioFim' já passou a tolerância de 15
    // minutos
    List<Reserva> reservasExpiradas = reservaRepository.findByHorarioFimBefore(limite);

    if (reservasExpiradas.isEmpty()) {
      log.info("Nenhuma reserva expirada encontrada. O agendador está ocioso.");
      return;
    }

    log.info("Foram encontradas {} reservas expiradas (com tolerância de {} min). Iniciando a liberação.",
        reservasExpiradas.size(), TOLERANCIA_MINUTOS);

    for (Reserva reserva : reservasExpiradas) {
      Recurso recurso = reserva.getRecurso();
      if (recurso != null) {
        recurso.setStatus("available");
        recursoRepository.save(recurso);
        log.info("Recurso com ID {} (Vaga: {}) liberado devido a expiração.", recurso.getId(), recurso.getNome());
      }

      // Deleta a reserva
      reservaRepository.delete(reserva);
    }

    log.info("Verificação de reservas expiradas concluída.");
  }
}
