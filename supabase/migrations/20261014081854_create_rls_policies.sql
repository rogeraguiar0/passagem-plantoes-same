-- Listas: só leitura pela API (você gerencia pelo painel ou SQL)
create policy "collaborators: leitura" on public.collaborators
  for select to authenticated using (true);

create policy "sectors: leitura" on public.sectors
  for select to authenticated using (true);

create policy "health_insurances: leitura" on public.health_insurances
  for select to authenticated using (true);

create policy "doctors: leitura" on public.doctors
  for select to authenticated using (true);

create policy "schedule: leitura" on public.schedule
  for select to authenticated using (true);

-- Lançamentos: ler, criar e atualizar (status), sem excluir
create policy "entries: leitura" on public.entries
  for select to authenticated using (true);

create policy "entries: criar" on public.entries
  for insert to authenticated with check (true);

create policy "entries: atualizar" on public.entries
  for update to authenticated using (true) with check (true);

-- Observações e anexos: ler e criar, sem editar nem excluir
create policy "observations: leitura" on public.observations
  for select to authenticated using (true);

create policy "observations: criar" on public.observations
  for insert to authenticated with check (true);

create policy "attachments: leitura" on public.attachments
  for select to authenticated using (true);

create policy "attachments: criar" on public.attachments
  for insert to authenticated with check (true);

-- Sugestões: só enviar (ninguém lê pela API)
create policy "suggestions: criar" on public.suggestions
  for insert to authenticated with check (true);