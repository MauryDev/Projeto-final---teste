insert into USUARIOS (id, username, password, role) values (100, 'ana@email.com', '$2a$10$/2wwWqGZgZQqiNjpjwhpu.7enJiX225i3OHpo.yVKx3IwbGIVsAjy', 'ROLE_ADMIN');
insert into USUARIOS (id, username, password, role) values (101, 'bia@email.com', '$2a$10$/2wwWqGZgZQqiNjpjwhpu.7enJiX225i3OHpo.yVKx3IwbGIVsAjy', 'ROLE_CLIENTE');
insert into USUARIOS (id, username, password, role) values (102, 'bob@email.com', '$2a$10$/2wwWqGZgZQqiNjpjwhpu.7enJiX225i3OHpo.yVKx3IwbGIVsAjy', 'ROLE_CLIENTE');
insert into USUARIOS (id, username, password, role) values (103, 'toby@email.com', '$2a$10$2ATGc5BW8SCNKjUQI1ZkfOBh6cRk6Jg3IK.B6bwWdQYD4NWf4tUVG', 'ROLE_CLIENTE');

insert into CLIENTES (id, nome, cpf, telefone, usuario_id) values (10, 'Bianca Silva', '74750272019', '71999999999', 101);
insert into CLIENTES (id, nome, cpf, telefone, usuario_id) values (20, 'Roberto Gomes', '55352517047', '71988888888', 102);