package br.edu.ifba.park.iot.backend.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.ifba.park.iot.backend.model.Reservation;
import br.edu.ifba.park.iot.backend.model.Resource;
import br.edu.ifba.park.iot.backend.security.model.Usuario;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

  // Verifica se um usuário já possui uma reserva ativa para um recurso específico
  boolean existsByUserAndResource(Usuario user, Resource resource);

  // Encontra uma reserva ativa de um usuário para um recurso específico
  Optional<Reservation> findByUserAndResource(Usuario user, Resource resource);

  // Encontra todas as reservas de um usuário
  List<Reservation> findByUser(Usuario user);

  List<Reservation> findByEndTimeBefore(LocalDateTime now);
}
