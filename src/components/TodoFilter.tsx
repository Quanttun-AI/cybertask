
import React from 'react';
import { useTodo } from '@/contexts/TodoContext';
import { useLanguage } from '@/contexts/LanguageContext';

const TodoFilter: React.FC = () => {
  const { filter, setFilter, activeTodoCount, clearCompleted } = useTodo();
  const { t } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-md bg-secondary/20 text-sm neon-border">
      <span className="text-muted-foreground mb-2 sm:mb-0">
        {activeTodoCount} {activeTodoCount === 1 ? t('taskLeft') : t('tasksLeft')}
      </span>
      
      <div className="flex flex-wrap gap-2 mb-2 sm:mb-0">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-full transition-colors ${
            filter === 'all' 
              ? 'bg-neon-purple/30 text-neon-purple' 
              : 'hover:bg-secondary/80'
          }`}
        >
          {t('all')}
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-3 py-1 rounded-full transition-colors ${
            filter === 'active' 
              ? 'bg-neon-purple/30 text-neon-purple' 
              : 'hover:bg-secondary/80'
          }`}
        >
          {t('active')}
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3 py-1 rounded-full transition-colors ${
            filter === 'completed' 
              ? 'bg-neon-purple/30 text-neon-purple' 
              : 'hover:bg-secondary/80'
          }`}
        >
          {t('completed')}
        </button>
      </div>
      
      <button
        onClick={clearCompleted}
        className="text-muted-foreground hover:text-neon-purple transition-colors underline"
      >
        {t('clearCompleted')}
      </button>
    </div>
  );
};

export default TodoFilter;
