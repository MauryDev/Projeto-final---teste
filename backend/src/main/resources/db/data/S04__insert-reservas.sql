DO '
DECLARE
    v_usuario_id BIGINT;
    v_veiculo_id BIGINT;
    vaga_id BIGINT;
BEGIN
    RAISE NOTICE ''--- Iniciando o script de inserção ---'';

    -- 1. Garante que o usuário exista
    SELECT id INTO v_usuario_id FROM usuarios WHERE username = ''albertinesilva17@gmail.com'';
    IF v_usuario_id IS NULL THEN
        RAISE NOTICE ''Usuário não encontrado. Inserindo novo...'';
        INSERT INTO usuarios (username, email, senha, nome)
        VALUES (''albertinesilva17@gmail.com'', ''albertinesilva17@gmail.com'', ''senha_segura'', ''Albertine Silva'')
        RETURNING id INTO v_usuario_id;
    END IF;
    RAISE NOTICE ''ID do Usuário: %'', v_usuario_id;

    -- 2. Garante que o recurso (vaga) exista
    SELECT id INTO vaga_id FROM recursos WHERE nome = ''Vaga 1'';
    IF vaga_id IS NULL THEN
        RAISE NOTICE ''Vaga não encontrada. Inserindo nova...'';
        INSERT INTO recursos (numero_vaga, nome, status, tipo)
        VALUES (1, ''Vaga 1'', ''available'', ''CARRO_PEQUENO'')
        RETURNING id INTO vaga_id;
    END IF;
    RAISE NOTICE ''ID da Vaga: %'', vaga_id;

    -- 3. Garante que o veículo exista
    SELECT id INTO v_veiculo_id FROM veiculos WHERE placa = ''ABC1234'';
    IF v_veiculo_id IS NULL THEN
        RAISE NOTICE ''Veículo não encontrado. Inserindo novo...'';
        INSERT INTO veiculos (placa, marca, modelo, usuario_id)
        VALUES (''ABC1234'', ''Chevrolet'', ''Onix'', v_usuario_id)
        RETURNING id INTO v_veiculo_id;
    END IF;
    RAISE NOTICE ''ID do Veículo: %'', v_veiculo_id;

    -- 4. Insere a reserva, agora que todas as dependências foram satisfeitas
    IF NOT EXISTS (SELECT 1 FROM reservas WHERE veiculo_id = v_veiculo_id AND horario_inicio = ''2025-09-22 10:00:00'') THEN
        RAISE NOTICE ''Inserindo a reserva...'';
        INSERT INTO reservas (recurso_id, usuario_id, veiculo_id, horario_inicio, horario_fim)
        VALUES (vaga_id, v_usuario_id, v_veiculo_id, ''2025-09-22 10:00:00'', ''2025-09-22 10:30:00'');
    ELSE
        RAISE NOTICE ''Reserva já existe. Nenhuma ação necessária.'';
    END IF;

    RAISE NOTICE ''--- Fim do script de inserção ---'';
END
';