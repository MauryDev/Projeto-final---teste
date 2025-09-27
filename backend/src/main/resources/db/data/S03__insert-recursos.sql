DO
'
BEGIN
    IF NOT EXISTS (SELECT 1 FROM recursos) THEN
        INSERT INTO recursos (numero_vaga, nome, status, tipo)
        VALUES 
        -- 15 Vagas para Carro Pequeno
        (1, ''Vaga 1'', ''available'', ''CARRO_PEQUENO''),
        (2, ''Vaga 2'', ''available'', ''CARRO_PEQUENO''),
        (3, ''Vaga 3'', ''available'', ''CARRO_PEQUENO''),
        (4, ''Vaga 4'', ''available'', ''CARRO_PEQUENO''),
        (5, ''Vaga 5'', ''available'', ''CARRO_PEQUENO''),
        (6, ''Vaga 6'', ''available'', ''CARRO_PEQUENO''),
        (7, ''Vaga 7'', ''available'', ''CARRO_PEQUENO''),
        (8, ''Vaga 8'', ''available'', ''CARRO_PEQUENO''),
        (9, ''Vaga 9'', ''available'', ''CARRO_PEQUENO''),
        (10, ''Vaga 10'', ''available'', ''CARRO_PEQUENO''),
        (11, ''Vaga 11'', ''available'', ''CARRO_PEQUENO''),
        (12, ''Vaga 12'', ''available'', ''CARRO_PEQUENO''),
        (13, ''Vaga 13'', ''available'', ''CARRO_PEQUENO''),
        (14, ''Vaga 14'', ''available'', ''CARRO_PEQUENO''),
        (15, ''Vaga 15'', ''available'', ''CARRO_PEQUENO''),
        
        -- 10 Vagas para Moto
        (16, ''Vaga 16'', ''available'', ''MOTO''),
        (17, ''Vaga 17'', ''available'', ''MOTO''),
        (18, ''Vaga 18'', ''available'', ''MOTO''),
        (19, ''Vaga 19'', ''available'', ''MOTO''),
        (20, ''Vaga 20'', ''available'', ''MOTO''),
        (21, ''Vaga 21'', ''available'', ''MOTO''),
        (22, ''Vaga 22'', ''available'', ''MOTO''),
        (23, ''Vaga 23'', ''available'', ''MOTO''),
        (24, ''Vaga 24'', ''available'', ''MOTO''),
        (25, ''Vaga 25'', ''available'', ''MOTO''),
        

        -- 3 Vagas de Prioridade
        (26, ''Vaga 26'', ''available'', ''VAGA_PRIORIDADE''),
        (27, ''Vaga 27'', ''available'', ''VAGA_PRIORIDADE''),
        (28, ''Vaga 28'', ''available'', ''VAGA_PRIORIDADE''),

        -- 3 Vagas PCD (Pessoas com Deficiência)
        (29, ''Vaga 29'', ''available'', ''VAGA_PCD''),
        (30, ''Vaga 30'', ''available'', ''VAGA_PCD''),
        (31, ''Vaga 31'', ''available'', ''VAGA_PCD''),

        -- 2 Vagas para Carro Grande
        (32, ''Vaga 32'', ''available'', ''CARRO_GRANDE''),
        (33, ''Vaga 33'', ''available'', ''CARRO_GRANDE''),

        -- 2 Vagas para Carro Elétrico
        (34, ''Vaga 34'', ''available'', ''VAGA_ELETRICA''),
        (35, ''Vaga 35'', ''available'', ''VAGA_ELETRICA'');
    END IF;
END
';