package br.edu.ifba.park.iot.backend.infra.exception.password;

public class PasswordInvalidException extends RuntimeException {

    public PasswordInvalidException(String message) {
        super(message);
    }
}
