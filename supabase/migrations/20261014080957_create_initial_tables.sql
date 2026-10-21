-- =========================================
-- Tipos fixos
-- =========================================
create type entry_type as enum ('internacao', 'atendimento', 'aviso', 'outros');
create type entry_status as enum ('pending', 'concluded');
create type shift_period as enum ('day', 'night'); -- day = 07h-19h, night = 19h-07h

-- =========================================
-- Listas editáveis
-- =========================================
create table public.collaborators (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.sectors (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table public.health_insurances (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table public.doctors (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

-- =========================================
-- Espelho de escala
-- shift_date = data em que o plantão COMEÇA
-- =========================================
create table public.schedule (
  id uuid primary key default gen_random_uuid(),
  shift_date date not null,
  period shift_period not null,
  collaborator_id uuid not null references public.collaborators (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (shift_date, period, collaborator_id)
);

-- =========================================
-- Lançamentos
-- =========================================
create table public.entries (
  id uuid primary key default gen_random_uuid(),
  type entry_type not null default 'aviso',
  status entry_status not null default 'pending',
  priority smallint not null default 1 check (priority between 1 and 3),
  collaborator_id uuid not null references public.collaborators (id),
  sector_id uuid references public.sectors (id),
  health_insurance_id uuid references public.health_insurances (id),
  doctor_id uuid references public.doctors (id),
  occurred_at timestamptz not null default now(), -- horário informado, define o plantão
  description text not null,
  created_at timestamptz not null default now()   -- momento real do registro
);

-- =========================================
-- Observações e anexos
-- =========================================
create table public.observations (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.entries (id) on delete cascade,
  collaborator_id uuid not null references public.collaborators (id),
  content text not null,
  created_at timestamptz not null default now()
);

create table public.attachments (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.entries (id) on delete cascade,
  collaborator_id uuid not null references public.collaborators (id),
  file_name text not null,
  file_path text not null unique,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0),
  created_at timestamptz not null default now()
);

-- =========================================
-- Sugestões (tela Opções)
-- =========================================
create table public.suggestions (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  created_at timestamptz not null default now()
);

-- =========================================
-- Índices (feed, filtros e relações)
-- =========================================
create index entries_occurred_at_idx on public.entries (occurred_at desc);
create index entries_status_idx on public.entries (status);
create index entries_type_idx on public.entries (type);
create index entries_collaborator_idx on public.entries (collaborator_id);
create index entries_sector_idx on public.entries (sector_id);
create index entries_health_insurance_idx on public.entries (health_insurance_id);
create index entries_doctor_idx on public.entries (doctor_id);
create index observations_entry_idx on public.observations (entry_id);
create index attachments_entry_idx on public.attachments (entry_id);
create index schedule_shift_idx on public.schedule (shift_date, period);

-- =========================================
-- RLS
-- =========================================
alter table public.collaborators enable row level security;
alter table public.sectors enable row level security;
alter table public.health_insurances enable row level security;
alter table public.doctors enable row level security;
alter table public.schedule enable row level security;
alter table public.entries enable row level security;
alter table public.observations enable row level security;
alter table public.attachments enable row level security;
alter table public.suggestions enable row level security;