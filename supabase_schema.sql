-- CryptoTrace Database Schema
-- Run this in your Supabase SQL Editor

-- ENUMS
CREATE TYPE chain_type AS ENUM ('ethereum', 'tron');
CREATE TYPE crime_type AS ENUM ('fraud', 'ransomware', 'investment_scam', 'darknet', 'laundering', 'terrorism_financing');
CREATE TYPE case_status AS ENUM ('running', 'completed', 'failed');
CREATE TYPE entity_type AS ENUM ('suspect', 'intermediate', 'vasp', 'mixer', 'bridge', 'unknown');
CREATE TYPE vasp_type AS ENUM ('exchange', 'otc_desk', 'mixer', 'bridge');
CREATE TYPE risk_level AS ENUM ('high', 'medium', 'low');
CREATE TYPE report_format AS ENUM ('pdf', 'json');

-- TABLES
CREATE TABLE cases (
    id TEXT PRIMARY KEY,
    wallet_address TEXT NOT NULL,
    chain chain_type NOT NULL,
    reporting_officer TEXT,
    crime_category crime_type,
    status case_status DEFAULT 'running',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    address TEXT NOT NULL,
    chain chain_type NOT NULL,
    label TEXT,
    entity_type entity_type DEFAULT 'unknown',
    first_seen TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(address, chain)
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id TEXT REFERENCES cases(id) ON DELETE CASCADE,
    tx_hash TEXT NOT NULL,
    from_addr TEXT NOT NULL,
    to_addr TEXT NOT NULL,
    value NUMERIC,
    token TEXT,
    block_time TIMESTAMPTZ,
    hop INTEGER,
    UNIQUE(tx_hash, case_id)
);

CREATE TABLE known_vasps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    address TEXT NOT NULL,
    chain chain_type NOT NULL,
    vasp_name TEXT NOT NULL,
    vasp_type vasp_type NOT NULL,
    UNIQUE(address, chain)
);

CREATE TABLE attributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id TEXT REFERENCES cases(id) ON DELETE CASCADE,
    source_wallet TEXT NOT NULL,
    vasp_address TEXT NOT NULL,
    confidence NUMERIC,
    risk risk_level,
    path JSONB,
    evidence JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id TEXT REFERENCES cases(id) ON DELETE CASCADE,
    format report_format NOT NULL,
    storage_path TEXT NOT NULL,
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SEED DATA (Mock Known VASPs for testing)
INSERT INTO known_vasps (address, chain, vasp_name, vasp_type) VALUES 
('0x28C6c06298d514Db089934071355E5743bf21d60', 'ethereum', 'Binance Hot Wallet', 'exchange'),
('0x77223F67D845E3CbcD9cc19287E24e71F7228888', 'ethereum', 'Kraken Deposit', 'exchange'),
('0x12D66f87A04A9E220743712cE6d9bB1B5616B8Fc', 'ethereum', 'Tornado Cash Proxy', 'mixer');
