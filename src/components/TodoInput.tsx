
import React, { useState, KeyboardEvent } from 'react';
import { useTodo } from '@/contexts/TodoContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Plus } from 'lucide-react';

const TodoInput: React.FC = () => {
  const [text, setText] = useState('');
  const { addTodo } = useTodo();
  const { t } = useLanguage();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSubmit = () => {
    if (text.trim() !== '') {
      setIsAnimating(true);
      addTodo(text);
      setText('');
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="flex items-center space-x-2 mb-6 p-3 rounded-md bg-secondary/20 neon-border">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        className="flex-1 bg-transparent border-none outline-none placeholder:text-muted-foreground focus:ring-0"
        placeholder={t('taskPlaceholder')}
      />
      <button
        onClick={handleSubmit}
        disabled={text.trim() === ''}
        className={`p-2 rounded-full transition-all duration-300 ${
          isAnimating ? 'scale-90' : 'scale-100'
        } ${
          text.trim() === '' 
            ? 'bg-secondary/50 text-muted-foreground' 
            : 'bg-neon-purple/20 text-neon-purple hover:bg-neon-purple/30'
        }`}
        aria-label={t('addTask')}
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
  );
};

export default TodoInput;
