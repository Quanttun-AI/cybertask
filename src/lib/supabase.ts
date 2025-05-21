
import { createClient } from '@supabase/supabase-js';

// Tipos para as tabelas do Supabase
export type UserProfile = {
  id: string;
  username: string;
  profile_image?: string;
  recovery_code: string;
  color_hue: number;
  created_at: string;
}

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  created_at: string;
  user_id: string;
}

// Cria o cliente Supabase
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Script para criar as tabelas necessárias no Supabase (executar no SQL editor do Supabase):
/*
-- Tabela de perfis de usuário
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  profile_image TEXT,
  recovery_code TEXT NOT NULL,
  color_hue INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de todos
CREATE TABLE IF NOT EXISTS todos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  user_id UUID REFERENCES auth.users(id) NOT NULL
);

-- Políticas de segurança RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Política para user_profiles
CREATE POLICY "Usuários podem ver e editar apenas seus próprios perfis" 
ON user_profiles FOR ALL 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);

-- Políticas para todos
CREATE POLICY "Usuários podem ver apenas seus próprios todos" 
ON todos FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios todos" 
ON todos FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar apenas seus próprios todos" 
ON todos FOR UPDATE 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar apenas seus próprios todos" 
ON todos FOR DELETE 
USING (auth.uid() = user_id);
*/
