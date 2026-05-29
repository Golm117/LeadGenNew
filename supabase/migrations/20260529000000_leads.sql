create table public.leads (
  id              uuid primary key default gen_random_uuid(),
  token           uuid not null default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  email           text not null,
  full_name       text,
  business_name   text,
  industry        text,
  answers         jsonb not null default '{}'::jsonb,
  readiness_score int  not null default 0,
  intent_score    int  not null default 0,
  intent_band     text not null default 'cold'
                    check (intent_band in ('hot','warm','cold')),
  routed_action   text,
  status          text not null default 'new',
  utm_source      text,
  utm_medium      text,
  utm_campaign    text,
  referrer        text
);

create index on public.leads (intent_band, created_at desc);
create unique index on public.leads (token);

alter table public.leads enable row level security;
