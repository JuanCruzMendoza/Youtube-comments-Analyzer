# Database Schema (Supabase)
```sql
create table public.video_analysis_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  video_id text not null,
  status text not null check (status in ('pending','processing','completed','failed')),
  language text not null,
  sensitivity numeric not null check (sensitivity between 0.1 and 1),
  comment_count integer default 0,
  summary jsonb,
  exports jsonb,
  error jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  completed_at timestamptz
);

create table public.comment_threads (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.video_analysis_runs(id) on delete cascade,
  external_id text not null,
  author jsonb,
  text text not null,
  language text,
  sentiment numeric,
  engagement jsonb,
  published_at timestamptz,
  metadata jsonb,
  created_at timestamptz default now()
);

create table public.comment_clusters (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.video_analysis_runs(id) on delete cascade,
  label text not null,
  category text not null check (category in ('praise','critique','recommendation','debate','other')),
  frequency numeric not null,
  sentiment_summary jsonb,
  examples text[],
  recommendations text[],
  llm_trace_id text,
  confidence numeric,
  created_at timestamptz default now()
);

create table public.cluster_comments (
  cluster_id uuid references public.comment_clusters(id) on delete cascade,
  comment_id uuid references public.comment_threads(id) on delete cascade,
  primary key (cluster_id, comment_id)
);

create policy "Enable all for authenticated users" on public.video_analysis_runs for all to authenticated with check (auth.uid() = user_id);
create policy "Enable all for authenticated users" on public.comment_threads for all to authenticated using (exists (select 1 from video_analysis_runs where video_analysis_runs.id = comment_threads.run_id));
create policy "Enable all for authenticated users" on public.comment_clusters for all to authenticated using (exists (select 1 from video_analysis_runs where video_analysis_runs.id = comment_clusters.run_id));

create policy "Delete runs older than 30 days" on public.video_analysis_runs for delete using (created_at < now() - interval '30 days');
```
