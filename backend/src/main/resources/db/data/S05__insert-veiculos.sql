DO '
DECLARE
    v_admin_id BIGINT;
    v_albertine_id BIGINT;
    v_maury_id BIGINT;
BEGIN
    -- Busca os IDs dos usuários
    SELECT id INTO v_admin_id FROM usuarios WHERE username = ''admin@gmail.com'';
    SELECT id INTO v_albertine_id FROM usuarios WHERE username = ''albertinesilva17@gmail.com'';
    SELECT id INTO v_maury_id FROM usuarios WHERE username = ''maury@gmail.com'';

    -- Veículos para admin
    IF v_admin_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM veiculos WHERE placa = ''ADM1234'') THEN
            INSERT INTO veiculos (placa, marca, modelo, usuario_id)
            VALUES (''ADM1234'', ''Toyota'', ''Corolla'', v_admin_id);
        END IF;

        IF NOT EXISTS (SELECT 1 FROM veiculos WHERE placa = ''ADM5678'') THEN
            INSERT INTO veiculos (placa, marca, modelo, usuario_id)
            VALUES (''ADM5678'', ''Honda'', ''Civic'', v_admin_id);
        END IF;
    END IF;

    -- Veículos para Albertine
    IF v_albertine_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM veiculos WHERE placa = ''ALB1234'') THEN
            INSERT INTO veiculos (placa, marca, modelo, usuario_id)
            VALUES (''ALB1234'', ''Chevrolet'', ''Onix'', v_albertine_id);
        END IF;

        IF NOT EXISTS (SELECT 1 FROM veiculos WHERE placa = ''ALB5678'') THEN
            INSERT INTO veiculos (placa, marca, modelo, usuario_id)
            VALUES (''ALB5678'', ''Fiat'', ''Argo'', v_albertine_id);
        END IF;
    END IF;

    -- Veículos para Maury
    IF v_maury_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM veiculos WHERE placa = ''MAU1234'') THEN
            INSERT INTO veiculos (placa, marca, modelo, usuario_id)
            VALUES (''MAU1234'', ''Volkswagen'', ''Gol'', v_maury_id);
        END IF;

        IF NOT EXISTS (SELECT 1 FROM veiculos WHERE placa = ''MAU5678'') THEN
            INSERT INTO veiculos (placa, marca, modelo, usuario_id)
            VALUES (''MAU5678'', ''Hyundai'', ''HB20'', v_maury_id);
        END IF;
    END IF;
END
';