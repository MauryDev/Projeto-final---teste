alter table if exists reservations 
  add constraint FKcuu9fjca4p9mplpssqwaopdea 
  foreign key (resource_id) 
  references resources;

alter table if exists reservations 
  add constraint FKtq452en54tt29rrveicd2k231 
  foreign key (user_id) 
  references usuarios;