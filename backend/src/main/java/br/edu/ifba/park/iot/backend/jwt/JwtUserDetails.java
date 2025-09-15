package br.edu.ifba.park.iot.backend.jwt;

import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;

import br.edu.ifba.park.iot.backend.security.model.Usuario;

public class JwtUserDetails extends User {

  private Usuario usuario;

  public JwtUserDetails(Usuario usuario) {
    super(usuario.getUsername(), usuario.getPassword(), AuthorityUtils.createAuthorityList(usuario.getRole().name()));
    this.usuario = usuario;
  }

  public Long getId() {
    return this.usuario.getId();
  }

  public String getRole() {
    return this.usuario.getRole().name();
  }
}
