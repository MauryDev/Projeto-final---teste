package br.edu.ifba.park.iot.backend.infra.exception.reserva;

public class ReservaConflictException extends RuntimeException {
  public ReservaConflictException(String message) {
    super(message);
  }
}
