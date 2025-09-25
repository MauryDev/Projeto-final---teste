package br.edu.ifba.park.iot.backend.model;

import br.edu.ifba.park.iot.backend.model.enums.TipoVaga;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "recursos")
public class Recurso {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "numero_vaga", nullable = false, unique = true)
  private Integer numeroVaga; // Novo atributo para a numeração

  @Column(name = "nome", nullable = false, unique = true)
  private String nome; // Ex: "Vaga 1", "Vaga 2"

  @Column(name = "status", nullable = false)
  private String status; // Status: "available", "occupied", "reserved"

  @Enumerated(EnumType.STRING) // Garante que o enum seja salvo como String
  @Column(name = "tipo")
  private TipoVaga tipo;
}