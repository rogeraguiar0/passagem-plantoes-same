insert into public.collaborators (name) values
  ('Marcilene'),
  ('Marina'),
  ('Yasnaia'),
  ('Róger'),
  ('Camila'),
  ('Julia'),
  ('Letícia')
on conflict (name) do nothing;