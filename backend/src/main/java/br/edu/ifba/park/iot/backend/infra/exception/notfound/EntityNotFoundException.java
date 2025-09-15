package br.edu.ifba.park.iot.backend.infra.exception.notfound;

public class EntityNotFoundException extends RuntimeException {

    public EntityNotFoundException(String message) {
        super(message);
    }
}
