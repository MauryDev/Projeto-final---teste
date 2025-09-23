DO '
BEGIN
    IF NOT EXISTS (SELECT 1 FROM resources) THEN
        INSERT INTO resources (name, status, type)
        VALUES 
        (''Vaga 01'', ''available'', ''Parking Spot''),
        (''Vaga 02'', ''available'', ''Parking Spot''),
        (''Vaga 03'', ''available'', ''Parking Spot''),
        (''Vaga 04'', ''available'', ''Parking Spot''),
        (''Vaga 05'', ''available'', ''Parking Spot''),
        (''Vaga 06'', ''available'', ''Parking Spot''),
        (''Vaga 07'', ''available'', ''Parking Spot''),
        (''Vaga 08'', ''available'', ''Parking Spot''),
        (''Vaga 09'', ''available'', ''Parking Spot''),
        (''Vaga 10'', ''available'', ''Parking Spot'');
    END IF;
END
';