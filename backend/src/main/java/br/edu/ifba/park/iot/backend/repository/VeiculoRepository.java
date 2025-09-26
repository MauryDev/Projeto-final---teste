package br.edu.ifba.park.iot.backend.repository;

import br.edu.ifba.park.iot.backend.model.Veiculo;
import br.edu.ifba.park.iot.backend.security.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VeiculoRepository extends JpaRepository<Veiculo, Long> {

  Optional<Veiculo> findByPlaca(String placa);

  List<Veiculo> findByUsuario(Usuario usuario);

  Optional<Veiculo> findByIdAndUsuario(Long id, Usuario usuario);
  
}