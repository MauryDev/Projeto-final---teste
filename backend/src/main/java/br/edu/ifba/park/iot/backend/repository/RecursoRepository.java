package br.edu.ifba.park.iot.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import br.edu.ifba.park.iot.backend.model.Recurso;

@Repository
public interface RecursoRepository extends JpaRepository<Recurso, Long> {

  @Query("SELECT MAX(r.numeroVaga) FROM Recurso r")
  Integer findLastNumeroVaga();
}
