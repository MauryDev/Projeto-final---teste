package br.edu.ifba.park.iot.backend.infra.exception.phone;

public class PhoneUniqueViolationException extends RuntimeException {
    public PhoneUniqueViolationException(String phone) {
        super("Telefone " + phone + " não pode ser cadastrado, pois já existe no sistema");
    }
}
