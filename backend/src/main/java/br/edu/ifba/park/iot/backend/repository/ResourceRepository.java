package br.edu.ifba.park.iot.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.ifba.park.iot.backend.model.Resource;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

}
