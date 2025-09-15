DO '
BEGIN
    IF NOT EXISTS (SELECT 1 FROM usuarios) THEN
        INSERT INTO usuarios (activated, data_criacao, data_modificacao, username, password, criado_por, modificado_por, role)
        VALUES (true, ''2025-08-20 14:45:00'', ''2025-08-20 14:45:00'', ''admin@gmail.com'', ''$2a$10$m/F3WE3Y3AgCW/YBX5dz9uZEc4XMhGUq.VsKJ8H7ikRP5JofWWuWC'', ''System'', ''System'', ''ROLE_ADMIN''),
        (true, ''2025-08-20 14:45:00'', ''2025-08-21 14:45:00'', ''albertinesilva17@gmail.com'', ''$2a$10$m/F3WE3Y3AgCW/YBX5dz9uZEc4XMhGUq.VsKJ8H7ikRP5JofWWuWC'', ''System'', ''System'', ''ROLE_CLIENTE''),
        (true, ''2025-08-20 14:45:00'', ''2025-08-21 14:45:00'', ''maury@gmail.com'', ''$2a$10$m/F3WE3Y3AgCW/YBX5dz9uZEc4XMhGUq.VsKJ8H7ikRP5JofWWuWC'', ''System'', ''System'', ''ROLE_CLIENTE'');
    END IF;
END
';