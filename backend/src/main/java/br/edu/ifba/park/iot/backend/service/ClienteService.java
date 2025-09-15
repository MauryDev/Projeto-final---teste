package br.edu.ifba.park.iot.backend.service;

import lombok.RequiredArgsConstructor;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.edu.ifba.park.iot.backend.infra.exception.cpf.CpfUniqueViolationException;
import br.edu.ifba.park.iot.backend.infra.exception.notfound.EntityNotFoundException;
import br.edu.ifba.park.iot.backend.infra.exception.phone.PhoneUniqueViolationException;
import br.edu.ifba.park.iot.backend.model.Cliente;
import br.edu.ifba.park.iot.backend.repository.ClienteRepository;

@RequiredArgsConstructor
@Service
public class ClienteService {

  private final ClienteRepository clienteRepository;

  @Transactional
  public Cliente salvar(Cliente cliente) {

    if (clienteRepository.existsByTelefone(cliente.getTelefone())) {
      throw new PhoneUniqueViolationException(cliente.getTelefone());
    }
    try {
      return clienteRepository.save(cliente);

    } catch (DataIntegrityViolationException ex) {
      throw new CpfUniqueViolationException(
          String.format("CPF %s não pode ser cadastrado, pois já existe no sistema", cliente.getCpf()));
    }
  }

  @Transactional(readOnly = true)
  public Cliente buscarPorId(Long id) {
    return clienteRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException(String.format("Cliente com id %s não encontrado", id)));
  }

  @Transactional(readOnly = true)
  public Page<Cliente> buscarTodos(Pageable pageable) {
    return clienteRepository.findAll(pageable);
  }
}
