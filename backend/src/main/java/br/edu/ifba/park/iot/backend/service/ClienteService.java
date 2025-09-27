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
import br.edu.ifba.park.iot.backend.model.dto.cliente.request.ClienteRequestDto;
import br.edu.ifba.park.iot.backend.repository.ClienteRepository;
import br.edu.ifba.park.iot.backend.security.repository.UsuarioRepository;

@RequiredArgsConstructor
@Service
public class ClienteService {

  private final ClienteRepository clienteRepository;
  private final UsuarioRepository usuarioRepository;

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

  @Transactional
  public Cliente updateCliente(Long clienteId, ClienteRequestDto dto) {
    // Busca o cliente pelo ID
    Cliente cliente = clienteRepository.findById(clienteId)
        .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

    // Valida telefone único, ignorando o próprio cliente
    clienteRepository.findByTelefoneAndIdNot(dto.getTelefone(), clienteId)
        .ifPresent(c -> {
          throw new PhoneUniqueViolationException(
              "Telefone " + dto.getTelefone() + " não pode ser cadastrado, pois já existe no sistema");
        });

    // Atualiza dados do cliente
    cliente.setNome(dto.getNome());
    cliente.setCpf(dto.getCpf());
    cliente.setTelefone(dto.getTelefone());

    // Atualiza o email no usuário vinculado
    if (cliente.getUsuario() != null) {
      cliente.getUsuario().setUsername(dto.getEmail());
      usuarioRepository.save(cliente.getUsuario());
    }

    // Persiste alterações
    return clienteRepository.save(cliente);
  }

  public Cliente buscarPorUsuarioId(Long usuarioId) {
    return clienteRepository.findByUsuarioId(usuarioId)
        .orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado"));
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
