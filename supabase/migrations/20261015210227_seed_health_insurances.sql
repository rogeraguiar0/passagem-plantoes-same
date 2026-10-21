insert into public.health_insurances (name) values
  ('SUS'),
  ('Particular'),
  ('Unimed'),
  ('Notredame/Hapvida'),
  ('Bradesco'),
  ('Cassi'),
  ('Cenibra Nipo'),
  ('Cenibra Logística'),
  ('Cemig Saúde'),
  ('Saúde Caixa'),
  ('Sulamerica'),
  ('Polícia Militar')
on conflict (name) do nothing;