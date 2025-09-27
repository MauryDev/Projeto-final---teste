package br.edu.ifba.park.iot.backend.jwt;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import br.edu.ifba.park.iot.backend.security.model.Usuario;
import br.edu.ifba.park.iot.backend.security.service.UsuarioService;

@RequiredArgsConstructor
@Service
public class JwtUserDetailsService implements UserDetailsService {

    private final UsuarioService usuarioService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioService.buscarPorUsername(username);
        return new JwtUserDetails(usuario);
    }

    public JwtToken getTokenAuthenticated(String username) {
        Usuario usuario = usuarioService.buscarPorUsername(username); // Pega o usuário completo
        Usuario.Role role = usuario.getRole();
        Long id = usuario.getId();
        return JwtUtils.createToken(username, id, role.name().substring("ROLE_".length()));
    }
}
