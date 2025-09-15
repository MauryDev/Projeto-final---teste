DO '
DECLARE
    albertine_id bigint;
    maury_id bigint;
BEGIN
    -- Busca os IDs dos usuários ''albertine'' e ''maury''
    SELECT id INTO albertine_id FROM usuarios WHERE username = ''albertinesilva17@gmail.com'';
    SELECT id INTO maury_id FROM usuarios WHERE username = ''maury@gmail.com'';

    -- Se os IDs existirem, insere os clientes correspondentes
    IF albertine_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM clientes WHERE usuario_id = albertine_id) THEN
        INSERT INTO clientes (data_criacao, data_modificacao, usuario_id, cpf, telefone, nome, criado_por, modificado_por)
        VALUES(''2025-08-15 10:30:00'', ''2025-08-16 10:30:00'', albertine_id, ''378.769.120-01'', ''75999465742'', ''Albert Silva de Jesus'', ''System'', ''System''),
        (''2025-08-20 14:45:00'', ''2025-08-21 14:45:00'', maury_id, ''895.585.300-93'', ''75981934711'', ''Maury Santos'', ''System'', ''System'');
    END IF;
END
';