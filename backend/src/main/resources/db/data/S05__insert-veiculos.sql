DO '
DECLARE
    -- Declara a variável para armazenar o ID do usuário
    v_usuario_id BIGINT;
BEGIN
    -- Busca o ID do usuário ''albertinesilva17@gmail.com''
    SELECT id INTO v_usuario_id FROM usuarios WHERE username = ''albertinesilva17@gmail.com'';

    -- Se o usuário for encontrado, prossegue com a inserção do veículo
    IF v_usuario_id IS NOT NULL THEN
        -- Verifica se o veículo com a placa ''ABC1234'' já existe para evitar duplicatas
        IF NOT EXISTS (SELECT 1 FROM veiculos WHERE placa = ''ABC1234'') THEN
            -- Insere um novo veículo
            INSERT INTO veiculos (placa, marca, modelo, usuario_id)
            VALUES (''ABC1234'', ''Chevrolet'', ''Onix'', v_usuario_id);
        END IF;
    END IF;
END
';