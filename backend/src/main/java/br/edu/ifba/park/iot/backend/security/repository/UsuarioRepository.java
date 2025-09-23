package br.edu.ifba.park.iot.backend.security.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import br.edu.ifba.park.iot.backend.security.model.Usuario;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
  Optional<Usuario> findByUsername(String username);

  @Query("select u.role from Usuario u where u.username like :username")
  Usuario.Role findRoleByUsername(String username);
}