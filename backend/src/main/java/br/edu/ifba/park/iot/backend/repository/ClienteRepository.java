package br.edu.ifba.park.iot.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.edu.ifba.park.iot.backend.model.Cliente;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    boolean existsByTelefone(String telefone);

    @Query("SELECT c FROM Cliente c JOIN FETCH c.usuario u WHERE u.id = :usuarioId")
    Optional<Cliente> findByUsuarioId(@Param("usuarioId") Long usuarioId);

    @Query("SELECT c FROM Cliente c WHERE c.telefone = :telefone AND c.id <> :id")
    Optional<Cliente> findByTelefoneAndIdNot(@Param("telefone") String telefone, @Param("id") Long id);
}
