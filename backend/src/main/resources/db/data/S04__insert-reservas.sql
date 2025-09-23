DO '
DECLARE
    vaga_id BIGINT;
    v_usuario_id BIGINT;
BEGIN
    -- Busca o ID do recurso ''Vaga 01''
    SELECT id INTO vaga_id FROM recursos WHERE nome = ''Vaga 01'';

    -- Busca o ID do usuário ''albertinesilva17@gmail.com''
    SELECT id INTO v_usuario_id FROM usuarios WHERE username = ''albertinesilva17@gmail.com'';

    -- Insere uma reserva apenas se os IDs forem encontrados
    IF vaga_id IS NOT NULL AND v_usuario_id IS NOT NULL THEN
        -- Verifica se a reserva já existe
        IF NOT EXISTS (SELECT 1 FROM reservas WHERE recurso_id = vaga_id AND usuario_id = v_usuario_id) THEN
            INSERT INTO reservas (recurso_id, usuario_id, horario_inicio, horario_fim)
            VALUES (vaga_id, v_usuario_id, ''2025-09-22 10:00:00'', ''2025-09-22 10:30:00'');
        END IF;
    END IF;
END
';