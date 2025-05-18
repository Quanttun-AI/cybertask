
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import TodoInput from '@/components/TodoInput';
import TodoItem from '@/components/TodoItem';
import TodoFilter from '@/components/TodoFilter';
import { useTodo } from '@/contexts/TodoContext';

const Index: React.FC = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const { t } = useLanguage();
  const { filteredTodos } = useTodo();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !currentUser) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold animate-text-glow mb-2">
            {t('todoList')}
          </h1>
          <p className="text-muted-foreground">
            {t('welcome')}, {currentUser.username}
          </p>
        </div>
        
        <div className="space-y-6">
          <TodoInput />
          
          <div className="space-y-3">
            {filteredTodos.length > 0 ? (
              filteredTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  id={todo.id}
                  text={todo.text}
                  completed={todo.completed}
                />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>{t('noTasks')}</p>
              </div>
            )}
          </div>
          
          {filteredTodos.length > 0 && <TodoFilter />}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
