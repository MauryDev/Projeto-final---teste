package br.edu.ifba.park.iot.backend.infra.exception.username;

public class UsernameUniqueViolationException extends RuntimeException {

    public UsernameUniqueViolationException(String message) {
        super(message);
    }
}
