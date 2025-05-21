
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

type FilterType = 'all' | 'active' | 'completed';

interface TodoContextType {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  clearCompleted: () => void;
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  filteredTodos: Todo[];
  activeTodoCount: number;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const [filter, setFilter] = useState<FilterType>('all');
  const queryClient = useQueryClient();

  // Função para buscar todos
  const fetchTodos = async (): Promise<Todo[]> => {
    if (!user) return [];
    
    const { data, error } = await supabaseClient
      .from('todos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar todos:', error);
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      text: item.text,
      completed: item.completed,
      createdAt: item.created_at
    }));
  };

  // Query para buscar todos
  const { data: todos = [] } = useQuery({
    queryKey: ['todos', user?.id],
    queryFn: fetchTodos,
    enabled: !!user && isAuthenticated
  });

  // Mutation para adicionar todo
  const addTodoMutation = useMutation({
    mutationFn: async (text: string) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      const { data, error } = await supabaseClient
        .from('todos')
        .insert({
          text,
          completed: false,
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', user?.id] });
    },
    onError: (error) => {
      console.error('Erro ao adicionar todo:', error);
      toast.error('Erro ao adicionar tarefa');
    }
  });

  // Mutation para atualizar todo
  const updateTodoMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { data, error } = await supabaseClient
        .from('todos')
        .update({ completed })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', user?.id] });
    },
    onError: (error) => {
      console.error('Erro ao atualizar todo:', error);
      toast.error('Erro ao atualizar tarefa');
    }
  });

  // Mutation para deletar todo
  const deleteTodoMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabaseClient
        .from('todos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', user?.id] });
    },
    onError: (error) => {
      console.error('Erro ao deletar todo:', error);
      toast.error('Erro ao deletar tarefa');
    }
  });

  // Mutation para limpar todos completados
  const clearCompletedMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabaseClient
        .from('todos')
        .delete()
        .eq('completed', true);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', user?.id] });
    },
    onError: (error) => {
      console.error('Erro ao limpar todos completados:', error);
      toast.error('Erro ao limpar tarefas concluídas');
    }
  });

  const addTodo = (text: string) => {
    if (!text.trim() || !user) return;
    addTodoMutation.mutate(text);
  };

  const toggleTodo = (id: string) => {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
      updateTodoMutation.mutate({ id, completed: !todo.completed });
    }
  };

  const deleteTodo = (id: string) => {
    deleteTodoMutation.mutate(id);
  };

  const clearCompleted = () => {
    clearCompletedMutation.mutate();
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeTodoCount = todos.filter(todo => !todo.completed).length;

  return (
    <TodoContext.Provider value={{
      todos,
      addTodo,
      toggleTodo,
      deleteTodo,
      clearCompleted,
      filter,
      setFilter,
      filteredTodos,
      activeTodoCount
    }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};
