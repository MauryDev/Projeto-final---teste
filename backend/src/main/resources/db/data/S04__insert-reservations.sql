DO '
DECLARE
    vaga_id BIGINT;
    usuario_id BIGINT;
BEGIN
    -- Busca o ID do recurso ''Vaga 01''
    SELECT id INTO vaga_id FROM resources WHERE name = ''Vaga 01'';
    
    -- Busca o ID do usuário ''albertinesilva17@gmail.com''
    SELECT id INTO usuario_id FROM usuarios WHERE username = ''albertinesilva17@gmail.com'';

    -- Insere uma reserva apenas se os IDs forem encontrados
    IF vaga_id IS NOT NULL AND usuario_id IS NOT NULL THEN
        -- Verifica se a reserva já existe
        IF NOT EXISTS (SELECT 1 FROM reservations WHERE resource_id = vaga_id AND user_id = usuario_id) THEN
            INSERT INTO reservations (resource_id, user_id, start_time, end_time)
            VALUES (vaga_id, usuario_id, ''2025-09-22 10:00:00'', ''2025-09-22 10:30:00'');
        END IF;
    END IF;
END
';