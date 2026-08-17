create extension if not exists pgcrypto;
create table if not exists public.ppdb_applicants(
 id uuid primary key default gen_random_uuid(),
 registration_number text unique not null,
 nama_lengkap text not null, nik text not null, jenis_kelamin text, ttl text,
 nama_wali text not null, no_wa text not null, asal_sekolah text, alamat text,
 status text not null default 'menunggu',
 created_at timestamptz not null default now()
);
create table if not exists public.ppdb_documents(
 id uuid primary key default gen_random_uuid(),
 applicant_id uuid not null references public.ppdb_applicants(id) on delete cascade,
 document_type text not null,
 storage_path text not null,
 created_at timestamptz not null default now()
);
alter table public.ppdb_applicants enable row level security;
alter table public.ppdb_documents enable row level security;
create table if not exists public.admin_profiles(
 user_id uuid primary key references auth.users(id) on delete cascade,
 full_name text,
 role text not null default 'admin',
 created_at timestamptz not null default now()
);
alter table public.admin_profiles enable row level security;
create policy "admin can read own profile" on public.admin_profiles for select to authenticated using (user_id=auth.uid());
insert into storage.buckets(id,name,public) values('ppdb-documents','ppdb-documents',false) on conflict(id) do nothing;
-- Server menggunakan service role untuk insert PPDB dan upload dokumen.
-- Bucket dokumen sengaja PRIVATE karena berisi data pribadi.
