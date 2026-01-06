-- Database SQL for Supabase

CREATE TABLE slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status VARCHAR(10) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS if needed, but per prompt we assume direct access or user managing it.
-- ALTER TABLE slots ENABLE ROW LEVEL SECURITY;
