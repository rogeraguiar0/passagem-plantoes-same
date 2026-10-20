insert into public.sectors (name) values
  ('SAME'),
  ('Recepção'),
  ('Pronto Atendimento'),
  ('Clínica Médica'),
  ('Maternidade'),
  ('Outros')
on conflict (name) do nothing;