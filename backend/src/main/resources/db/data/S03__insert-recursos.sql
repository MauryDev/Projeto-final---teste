DO
'
BEGIN
    IF NOT EXISTS (SELECT 1 FROM recursos) THEN
        INSERT INTO recursos (nome, status, tipo)
        VALUES 
        (''Vaga 01'', ''available'', ''Vaga de Estacionamento''),
        (''Vaga 02'', ''available'', ''Vaga de Estacionamento''),
        (''Vaga 03'', ''available'', ''Vaga de Estacionamento''),
        (''Vaga 04'', ''available'', ''Vaga de Estacionamento''),
        (''Vaga 05'', ''available'', ''Vaga de Estacionamento''),
        (''Vaga 06'', ''available'', ''Vaga de Estacionamento''),
        (''Vaga 07'', ''available'', ''Vaga de Estacionamento''),
        (''Vaga 08'', ''available'', ''Vaga de Estacionamento''),
        (''Vaga 09'', ''available'', ''Vaga de Estacionamento''),
        (''Vaga 10'', ''available'', ''Vaga de Estacionamento'');
    END IF;
END
';