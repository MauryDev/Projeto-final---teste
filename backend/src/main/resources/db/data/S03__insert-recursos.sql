DO
'
BEGIN
    IF NOT EXISTS (SELECT 1 FROM recursos) THEN
        INSERT INTO recursos (numero_vaga, nome, status, tipo)
        VALUES 
        -- 25 Vagas para Carro Pequeno
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
        (16, ''Vaga 16'', ''available'', ''CARRO_PEQUENO''),
        (17, ''Vaga 17'', ''available'', ''CARRO_PEQUENO''),
        (18, ''Vaga 18'', ''available'', ''CARRO_PEQUENO''),
        (19, ''Vaga 19'', ''available'', ''CARRO_PEQUENO''),
        (20, ''Vaga 20'', ''available'', ''CARRO_PEQUENO''),
        (21, ''Vaga 21'', ''available'', ''CARRO_PEQUENO''),
        (22, ''Vaga 22'', ''available'', ''CARRO_PEQUENO''),
        (23, ''Vaga 23'', ''available'', ''CARRO_PEQUENO''),
        (24, ''Vaga 24'', ''available'', ''CARRO_PEQUENO''),
        (25, ''Vaga 25'', ''available'', ''CARRO_PEQUENO''),
        
        -- 15 Vagas para Moto
        (26, ''Vaga 26'', ''available'', ''MOTO''),
        (27, ''Vaga 27'', ''available'', ''MOTO''),
        (28, ''Vaga 28'', ''available'', ''MOTO''),
        (29, ''Vaga 29'', ''available'', ''MOTO''),
        (30, ''Vaga 30'', ''available'', ''MOTO''),
        (31, ''Vaga 31'', ''available'', ''MOTO''),
        (32, ''Vaga 32'', ''available'', ''MOTO''),
        (33, ''Vaga 33'', ''available'', ''MOTO''),
        (34, ''Vaga 34'', ''available'', ''MOTO''),
        (35, ''Vaga 35'', ''available'', ''MOTO''),
        (36, ''Vaga 36'', ''available'', ''MOTO''),
        (37, ''Vaga 37'', ''available'', ''MOTO''),
        (38, ''Vaga 38'', ''available'', ''MOTO''),
        (39, ''Vaga 39'', ''available'', ''MOTO''),
        (40, ''Vaga 40'', ''available'', ''MOTO''),

        -- 3 Vagas de Prioridade
        (41, ''Vaga 41'', ''available'', ''VAGA_PRIORIDADE''),
        (42, ''Vaga 42'', ''available'', ''VAGA_PRIORIDADE''),
        (43, ''Vaga 43'', ''available'', ''VAGA_PRIORIDADE''),

        -- 3 Vagas PCD (Pessoas com Deficiência)
        (44, ''Vaga 44'', ''available'', ''VAGA_PCD''),
        (45, ''Vaga 45'', ''available'', ''VAGA_PCD''),
        (46, ''Vaga 46'', ''available'', ''VAGA_PCD''),

        -- 2 Vagas para Carro Grande
        (47, ''Vaga 47'', ''available'', ''CARRO_GRANDE''),
        (48, ''Vaga 48'', ''available'', ''CARRO_GRANDE''),

        -- 2 Vagas para Carro Elétrico
        (49, ''Vaga 49'', ''available'', ''VAGA_ELETRICA''),
        (50, ''Vaga 50'', ''available'', ''VAGA_ELETRICA'');
    END IF;
END
';