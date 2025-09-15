package br.edu.ifba.park.iot.backend.security.model.dto.usuario.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UsuarioLoginRequestDto {
  @NotBlank
  @Email(message = "formato do e-mail está invalido", regexp = "^[a-z0-9.+-]+@[a-z0-9.-]+\\.[a-z]{2,}$")
  private String username;

  @NotBlank
  @Pattern(message = "A senha deve ter de 8 a 30 caracteres, com pelo menos uma letra maiúscula, uma minúscula e um caractere especial.", regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?\":{}|<>])(?=\\S+$).{8,30}$")
  private String password;
}
