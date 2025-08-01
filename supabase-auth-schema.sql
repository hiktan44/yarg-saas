-- YargıSys Auth + Search Platform Schema
-- This is for the SaaS search platform, not a case management system

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Search History Table
CREATE TABLE search_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  institutions TEXT[], -- Array of institution names searched
  filters JSONB, -- Search filters as JSON
  results_count INTEGER DEFAULT 0,
  search_time_ms INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved Documents Table  
CREATE TABLE saved_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id TEXT NOT NULL, -- External document ID from institutions
  title TEXT NOT NULL,
  institution TEXT NOT NULL,
  summary TEXT,
  document_url TEXT,
  metadata JSONB, -- Additional document metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- LLM Conversations Table
CREATE TABLE llm_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id TEXT, -- Optional: conversation about specific document
  llm_provider TEXT NOT NULL, -- 'openai', 'anthropic', 'google'
  messages JSONB NOT NULL, -- Array of messages
  metadata JSONB, -- Additional conversation metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Preferences Table
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  preferred_institutions TEXT[], -- User's favorite institutions
  search_settings JSONB, -- Search preferences
  ui_settings JSONB, -- UI preferences (theme, etc.)
  notification_settings JSONB, -- Notification preferences
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Usage Tracking (for future billing/limits)
CREATE TABLE api_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  api_type TEXT NOT NULL, -- 'search', 'llm', 'document'
  usage_count INTEGER DEFAULT 1,
  date DATE DEFAULT CURRENT_DATE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_search_history_user_id ON search_history(user_id);
CREATE INDEX idx_search_history_created_at ON search_history(created_at DESC);
CREATE INDEX idx_saved_documents_user_id ON saved_documents(user_id);
CREATE INDEX idx_saved_documents_institution ON saved_documents(institution);
CREATE INDEX idx_llm_conversations_user_id ON llm_conversations(user_id);
CREATE INDEX idx_llm_conversations_document_id ON llm_conversations(document_id);
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_api_usage_user_date ON api_usage(user_id, date);

-- Full-text search on saved documents
CREATE INDEX idx_saved_documents_title_search ON saved_documents USING gin(to_tsvector('turkish', title));
CREATE INDEX idx_saved_documents_summary_search ON saved_documents USING gin(to_tsvector('turkish', summary));

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_preferences_updated_at 
  BEFORE UPDATE ON user_preferences 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE llm_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Users can only access their own data
CREATE POLICY "Users can access their own search history" ON search_history
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access their own saved documents" ON saved_documents
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access their own LLM conversations" ON llm_conversations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access their own preferences" ON user_preferences
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access their own API usage" ON api_usage
  FOR ALL USING (auth.uid() = user_id);

-- Create a function to initialize user preferences
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_preferences (user_id, preferred_institutions, search_settings, ui_settings, notification_settings)
  VALUES (
    NEW.id,
    ARRAY[]::TEXT[], -- Empty array for preferred institutions
    '{"results_per_page": 20, "auto_search": false}'::JSONB,
    '{"theme": "light", "language": "tr"}'::JSONB,
    '{"email_notifications": true, "browser_notifications": false}'::JSONB
  );
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger to create user preferences when a new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create a function to get user stats (for dashboard)
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  search_count INTEGER;
  saved_count INTEGER;
  conversation_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO search_count FROM search_history WHERE user_id = user_uuid;
  SELECT COUNT(*) INTO saved_count FROM saved_documents WHERE user_id = user_uuid;
  SELECT COUNT(*) INTO conversation_count FROM llm_conversations WHERE user_id = user_uuid;
  
  RETURN json_build_object(
    'total_searches', search_count,
    'saved_documents', saved_count,
    'llm_conversations', conversation_count,
    'last_search', (SELECT created_at FROM search_history WHERE user_id = user_uuid ORDER BY created_at DESC LIMIT 1)
  );
END;
$$ language 'plpgsql' SECURITY DEFINER;