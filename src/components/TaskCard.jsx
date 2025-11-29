import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Trash2, Calendar, Pencil } from 'lucide-react';
import PriorityBadge from './UI/PriorityBadge';

const TaskCard = ({ task, index, columnId, openEditTask, requestDeleteTask }) => {
  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            group relative bg-slate-800 p-4 rounded-xl border border-slate-700/60 shadow-sm 
            hover:shadow-lg hover:border-slate-500 hover:-translate-y-0.5 transition-all duration-200
            ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-blue-500/50 rotate-2 z-9999 cursor-grabbing' : 'cursor-grab'}
          `}
          style={{ ...provided.draggableProps.style }}
        >
          <div className="flex justify-between items-start mb-2">
            <PriorityBadge level={task.priority || 'Low'} />
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={(e) => { e.stopPropagation(); openEditTask(columnId, task); }} 
                className="text-slate-500 hover:text-blue-400 p-1 rounded hover:bg-blue-500/10 transition-colors"
              >
                <Pencil size={14} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); requestDeleteTask(columnId, task); }} 
                className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          <p className="text-slate-200 font-medium text-sm mb-3 leading-snug">{task.content}</p>
          <div className="flex justify-between items-center pt-3 border-t border-slate-700/50">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
              <Calendar size={12} />
              <span>{task.date || 'Today'}</span>
            </div>
            <div className="w-6 h-6 rounded-full bg-indigo-500 border border-slate-800"></div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;