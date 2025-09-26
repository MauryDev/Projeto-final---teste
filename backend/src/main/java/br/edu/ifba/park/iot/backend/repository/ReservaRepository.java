package br.edu.ifba.park.iot.backend.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.ifba.park.iot.backend.model.Reserva;
import br.edu.ifba.park.iot.backend.model.Recurso;
import br.edu.ifba.park.iot.backend.security.model.Usuario;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

  // Verifica se um usuário já possui uma reserva ativa para um recurso específico
  boolean existsByUsuarioAndRecurso(Usuario usuario, Recurso recurso);

  // Encontra uma reserva ativa de um usuário para um recurso específico
  Optional<Reserva> findByUsuarioAndRecurso(Usuario usuario, Recurso recurso);

  // Encontra todas as reservas de um usuário
  List<Reserva> findByUsuario(Usuario usuario);

  // Encontra todas as reservas que terminaram antes do horário atual
  List<Reserva> findByHorarioFimBefore(LocalDateTime now);

  // Encontra todas as reservas ativas (sem horário de fim) de um usuário
  List<Reserva> findByUsuarioAndHorarioFimIsNull(Usuario usuario);

  // Verifica se um usuário possui uma reserva ativa (sem horário de fim) para um recurso específico
  boolean existsByUsuarioAndRecursoAndHorarioFimIsNull(Usuario usuario, Recurso recurso);

}
