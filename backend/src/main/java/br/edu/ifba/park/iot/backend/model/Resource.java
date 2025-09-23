package br.edu.ifba.park.iot.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "resources")
public class Resource {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "name", nullable = false, unique = true)
  private String name; // Ex: "Vaga 1", "Vaga 2"

  @Column(name = "status", nullable = false)
  private String status; // Status: "available", "occupied", "reserved"

  @Column(name = "type")
  private String type; // Ex: "Parking Spot"
}
