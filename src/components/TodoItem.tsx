
import React, { useState } from 'react';
import { useTodo } from '@/contexts/TodoContext';
import { Check, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TodoItemProps {
  id: string;
  text: string;
  completed: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({ id, text, completed }) => {
  const { toggleTodo, deleteTodo } = useTodo();
  const [isHovered, setIsHovered] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = () => {
    setIsChecking(true);
    toggleTodo(id);
    setTimeout(() => setIsChecking(false), 300);
  };

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      deleteTodo(id);
    }, 300);
  };

  return (
    <div 
      className={cn(
        "group flex items-center justify-between p-3 mb-2 rounded-md transition-all duration-300 neon-border",
        completed ? "bg-secondary/30" : "bg-secondary/10",
        isDeleting ? "scale-0 opacity-0" : "scale-100 opacity-100"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center space-x-3 flex-1">
        <button
          className={cn(
            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
            completed 
              ? "border-neon-purple bg-neon-purple/30" 
              : "border-gray-500 hover:border-neon-purple",
            isChecking && "scale-110"
          )}
          onClick={handleToggle}
          aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {completed && <Check className="h-4 w-4 text-white" />}
        </button>
        
        <span 
          className={cn(
            "flex-1 transition-all duration-200",
            completed && "text-muted-foreground line-through"
          )}
        >
          {text}
        </span>
      </div>
      
      <button
        onClick={handleDelete}
        className={cn(
          "p-1 rounded-full transition-all duration-200",
          isHovered ? "opacity-100" : "opacity-0",
          "hover:bg-destructive/20 hover:text-destructive"
        )}
        aria-label="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};

export default TodoItem;
