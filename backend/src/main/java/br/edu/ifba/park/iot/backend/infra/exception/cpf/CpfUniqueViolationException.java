package br.edu.ifba.park.iot.backend.infra.exception.cpf;

public class CpfUniqueViolationException extends RuntimeException {
    public CpfUniqueViolationException(String message) {
        super(message);
    }
}
