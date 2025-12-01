-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- video_analysis_runs
create table if not exists video_analysis_runs (
  id uuid primary key default uuid_generate_v4(),
  video_id text not null,
  user_id uuid, -- Nullable for now as we don't have auth
  status text not null check (status in ('pending', 'processing', 'completed', 'failed')),
  language text default 'en',
  sensitivity float default 0.5,
  comment_count int default 0,
  summary jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

-- comment_threads
create table if not exists comment_threads (
  id uuid primary key default uuid_generate_v4(),
  run_id uuid not null references video_analysis_runs(id) on delete cascade,
  external_id text not null,
  author jsonb not null, -- { name, avatar }
  text text not null,
  language text,
  sentiment float,
  engagement jsonb not null, -- { likes, replies }
  published_at timestamp with time zone,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- comment_clusters
create table if not exists comment_clusters (
  id uuid primary key default uuid_generate_v4(),
  run_id uuid not null references video_analysis_runs(id) on delete cascade,
  label text not null,
  category text not null check (category in ('praise', 'critique', 'recommendation', 'debate', 'other')),
  frequency float not null,
  sentiment_summary jsonb not null, -- { positive, neutral, negative }
  examples text[] not null,
  recommendations text[],
  llm_trace_id text,
  confidence float,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
