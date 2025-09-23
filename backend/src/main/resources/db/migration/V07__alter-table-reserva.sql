alter table if exists reservas 
  add constraint FKinumgn7htlywdgrk7tvdc73ot 
  foreign key (recurso_id) 
  references recursos;

alter table if exists reservas 
  add constraint FKcfh7qcr7oxomqk5hhbxdg2m7p 
  foreign key (usuario_id) 
  references usuarios;