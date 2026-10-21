-- Bucket privado, com limite de tamanho e tipos permitidos
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'attachments',
  'attachments',
  false,                 -- privado: só acessa com URL assinada
  10485760,              -- 10 MB por arquivo
  array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- Quem estiver logado pode enviar e ler arquivos deste bucket
create policy "attachments: upload autenticado"
on storage.objects for insert
to authenticated
with check (bucket_id = 'attachments');

create policy "attachments: leitura autenticada"
on storage.objects for select
to authenticated
using (bucket_id = 'attachments');