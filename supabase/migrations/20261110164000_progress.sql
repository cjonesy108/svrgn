-- Sovereign Path progress.
-- A signed-in user can read and write only their own rows.
-- Ranks, domains, and badges are app catalogs. This database stores the user's progress against those ids.
-- Do not put the service role key in the app. The anon key is public; these policies are the boundary.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  current_rank_id text,
  updated_at timestamptz not null default now(),
  constraint profiles_rank_known check (
    current_rank_id is null
    or current_rank_id in ('initiate', 'apprentice', 'journeyman', 'adept', 'sovereign')
  )
);

create table public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  version text not null,
  completed_at timestamptz not null,
  responses jsonb not null,
  domain_scores jsonb not null,
  overall_score integer not null check (overall_score >= 0 and overall_score <= 100),
  created_at timestamptz not null default now()
);

create index assessments_user_completed_idx
  on public.assessments (user_id, completed_at);

create table public.domain_scores (
  user_id uuid not null references auth.users (id) on delete cascade,
  domain_id text not null,
  score integer not null check (score >= 0 and score <= 100),
  assessment_id uuid not null references public.assessments (id) on delete cascade,
  updated_at timestamptz not null default now(),
  primary key (user_id, domain_id),
  constraint domain_scores_domain_known check (
    domain_id in (
      'physical',
      'financial',
      'practical',
      'mental',
      'relational',
      'purpose',
      'systems',
      'local',
      'rights',
      'community',
      'voting',
      'digital'
    )
  )
);

create table public.badge_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  badge_id text not null,
  status text not null check (status in ('in_progress', 'completed')),
  started_at timestamptz not null,
  completed_at timestamptz,
  reflection text,
  attested boolean not null default false,
  attested_at timestamptz,
  primary key (user_id, badge_id),
  constraint badge_progress_completed_fields check (
    status <> 'completed'
    or (
      completed_at is not null
      and attested
      and attested_at is not null
      and reflection is not null
      and length(trim(reflection)) >= 40
    )
  )
);

create table public.intake_drafts (
  user_id uuid primary key references auth.users (id) on delete cascade,
  step integer not null default 0 check (step >= 0),
  answers jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.assessments enable row level security;
alter table public.domain_scores enable row level security;
alter table public.badge_progress enable row level security;
alter table public.intake_drafts enable row level security;

alter table public.profiles force row level security;
alter table public.assessments force row level security;
alter table public.domain_scores force row level security;
alter table public.badge_progress force row level security;
alter table public.intake_drafts force row level security;

create policy profiles_select on public.profiles
  for select to authenticated
  using (auth.uid() = id);

create policy profiles_insert on public.profiles
  for insert to authenticated
  with check (auth.uid() = id);

create policy profiles_update on public.profiles
  for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy assessments_select on public.assessments
  for select to authenticated
  using (auth.uid() = user_id);

create policy assessments_insert on public.assessments
  for insert to authenticated
  with check (auth.uid() = user_id);

create policy assessments_update on public.assessments
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy domain_scores_select on public.domain_scores
  for select to authenticated
  using (auth.uid() = user_id);

create policy domain_scores_insert on public.domain_scores
  for insert to authenticated
  with check (auth.uid() = user_id);

create policy domain_scores_update on public.domain_scores
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy badge_progress_select on public.badge_progress
  for select to authenticated
  using (auth.uid() = user_id);

create policy badge_progress_insert on public.badge_progress
  for insert to authenticated
  with check (auth.uid() = user_id);

create policy badge_progress_update on public.badge_progress
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy intake_drafts_select on public.intake_drafts
  for select to authenticated
  using (auth.uid() = user_id);

create policy intake_drafts_insert on public.intake_drafts
  for insert to authenticated
  with check (auth.uid() = user_id);

create policy intake_drafts_update on public.intake_drafts
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy intake_drafts_delete on public.intake_drafts
  for delete to authenticated
  using (auth.uid() = user_id);

revoke all on public.profiles from anon;
revoke all on public.assessments from anon;
revoke all on public.domain_scores from anon;
revoke all on public.badge_progress from anon;
revoke all on public.intake_drafts from anon;

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.assessments to authenticated;
grant select, insert, update on public.domain_scores to authenticated;
grant select, insert, update on public.badge_progress to authenticated;
grant select, insert, update, delete on public.intake_drafts to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', ''));
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public;
revoke all on function public.handle_new_user() from anon;
revoke all on function public.handle_new_user() from authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

insert into public.profiles (id, display_name)
select id, coalesce(raw_user_meta_data ->> 'name', '')
from auth.users
on conflict (id) do nothing;
