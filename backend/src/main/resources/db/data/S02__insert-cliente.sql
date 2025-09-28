DO '
DECLARE
    admin_id bigint;
    albertine_id bigint;
    maury_id bigint;
BEGIN
    -- Busca os IDs dos usuários
    SELECT id INTO admin_id FROM usuarios WHERE username = ''admin@gmail.com'';
    SELECT id INTO albertine_id FROM usuarios WHERE username = ''albertinesilva17@gmail.com'';
    SELECT id INTO maury_id FROM usuarios WHERE username = ''maury@gmail.com'';

    -- Insere os clientes correspondentes, se ainda não existirem
    IF admin_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM clientes WHERE usuario_id = admin_id) THEN
        INSERT INTO clientes (data_criacao, data_modificacao, usuario_id, cpf, telefone, nome, criado_por, modificado_por)
        VALUES (''2025-08-15 09:00:00'', ''2025-08-15 09:00:00'', admin_id, ''000.000.000-00'', ''00000000000'', ''Administrador do Sistema'', ''System'', ''System'');
    END IF;

    IF albertine_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM clientes WHERE usuario_id = albertine_id) THEN
        INSERT INTO clientes (data_criacao, data_modificacao, usuario_id, cpf, telefone, nome, criado_por, modificado_por)
        VALUES (''2025-08-15 10:30:00'', ''2025-08-16 10:30:00'', albertine_id, ''378.769.120-01'', ''75999465742'', ''Albert Silva de Jesus'', ''System'', ''System'');
    END IF;

    IF maury_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM clientes WHERE usuario_id = maury_id) THEN
        INSERT INTO clientes (data_criacao, data_modificacao, usuario_id, cpf, telefone, nome, criado_por, modificado_por)
        VALUES (''2025-08-20 14:45:00'', ''2025-08-21 14:45:00'', maury_id, ''895.585.300-93'', ''75981934711'', ''Maury Santos'', ''System'', ''System'');
    END IF;
END
';