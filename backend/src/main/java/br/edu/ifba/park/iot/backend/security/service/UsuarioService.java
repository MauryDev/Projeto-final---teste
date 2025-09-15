package br.edu.ifba.park.iot.backend.security.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.edu.ifba.park.iot.backend.infra.exception.notfound.EntityNotFoundException;
import br.edu.ifba.park.iot.backend.infra.exception.password.PasswordInvalidException;
import br.edu.ifba.park.iot.backend.infra.exception.username.UsernameUniqueViolationException;
import br.edu.ifba.park.iot.backend.repository.UsuarioRepository;
import br.edu.ifba.park.iot.backend.security.model.Usuario;

import java.util.List;

@RequiredArgsConstructor
@Service
public class UsuarioService {

  private final UsuarioRepository usuarioRepository;
  private final PasswordEncoder passwordEncoder;

  @Transactional
  public Usuario salvar(Usuario usuario) {
    try {
      usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
      return usuarioRepository.save(usuario);
    } catch (org.springframework.dao.DataIntegrityViolationException ex) {
      throw new UsernameUniqueViolationException(String.format("Username: %s já cadastrado: ", usuario.getUsername()));
    }
  }

  @Transactional(readOnly = true)
  public Usuario buscarPorId(Long id) {
    return usuarioRepository.findById(id).orElseThrow(
        () -> new EntityNotFoundException(String.format("Usuário id=%s não encontrado", id)));
  }

  @Transactional
  public Usuario editarSenha(Long id, String senhaAtual, String novaSenha, String confirmaSenha) {
    if (!novaSenha.equals(confirmaSenha)) {
      throw new PasswordInvalidException("Nova senha não confere com confirmação de senha.");
    }

    Usuario user = buscarPorId(id);
    if (!passwordEncoder.matches(senhaAtual, user.getPassword())) {
      throw new PasswordInvalidException("Sua senha não confere.");
    }

    user.setPassword(passwordEncoder.encode(novaSenha));
    return user;

    // Outra forma de fazer a mesma coisa é:
    // return usuarioRepository.save(user);
  }

  @Transactional(readOnly = true)
  public List<Usuario> buscaTodos() {
    return usuarioRepository.findAll();
  }

  @Transactional(readOnly = true)
  public Usuario buscarPorUsername(String username) {
    return usuarioRepository.findByUsername(username).orElseThrow(
        () -> new EntityNotFoundException(String.format("Usuário username = %s não encontrado", username)));
  }

  @Transactional(readOnly = true)
  public Usuario.Role buscarRolePorUsername(String username) {
    return usuarioRepository.findRoleByUsername(username);
  }
}