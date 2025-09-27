package br.edu.ifba.park.iot.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import br.edu.ifba.park.iot.backend.security.model.Usuario;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "clientes")
@EntityListeners(AuditingEntityListener.class)
public class Cliente implements Serializable {
  private static final long serialVersionUID = 1L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "nome", nullable = false, length = 100)
  private String nome;

  @Column(name = "cpf", nullable = false, unique = true, length = 14)
  private String cpf;

  @Column(name = "telefone", nullable = false, unique = true, length = 15)
  private String telefone;

  @OneToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "usuario_id", nullable = false)
  private Usuario usuario;

  @CreatedDate
  @Column(name = "data_criacao")
  private LocalDateTime dataCriacao;

  @LastModifiedDate
  @Column(name = "data_modificacao")
  private LocalDateTime dataModificacao;

  @CreatedBy
  @Column(name = "criado_por")
  private String criadorPor;

  @LastModifiedBy
  @Column(name = "modificado_por")
  private String modificadoPor;

  @Override
  public int hashCode() {
    final int prime = 31;
    int result = 1;
    result = prime * result + ((id == null) ? 0 : id.hashCode());
    return result;
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj)
      return true;
    if (obj == null)
      return false;
    if (getClass() != obj.getClass())
      return false;
    Cliente other = (Cliente) obj;
    if (id == null) {
      if (other.id != null)
        return false;
    } else if (!id.equals(other.id))
      return false;
    return true;
  }

}