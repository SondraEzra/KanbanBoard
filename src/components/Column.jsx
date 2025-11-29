import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Plus, Trash2, Pencil, MoreHorizontal } from 'lucide-react';
import TaskCard from './TaskCard';

const Column = ({ 
  columnId, 
  column, 
  isActive, 
  isFirst, 
  isLast, 
  openEditColumn, 
  requestDeleteColumn, 
  openEditTask, 
  requestDeleteTask, 
  openAddTask 
}) => {
  return (
    <div 
      className={`shrink-0 w-full md:w-80 flex flex-col relative transition-all duration-200 
        ${isActive ? 'z-50' : 'z-0'}
        ${isFirst ? 'md:ml-auto' : ''} 
        ${isLast ? 'md:mr-auto' : ''}
      `}
    >
      <div className="absolute inset-0 bg-slate-900/50 rounded-2xl border border-slate-800/50 backdrop-blur-sm shadow-xl -z-10 pointer-events-none" />

      {/* Header Kolom */}
      <div className="flex justify-between items-center p-4 pb-2 z-10 group/header">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
          <h2 className="font-semibold text-slate-200 tracking-wide truncate max-w-[120px]">{column.title}</h2>
          <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full border border-slate-700">
            {column.items.length}
          </span>
        </div>
        <div className="flex gap-1 opacity-0 group-hover/header:opacity-100 transition-opacity">
          <button onClick={() => openEditColumn(columnId)} className="text-slate-500 hover:text-blue-400 p-1 rounded hover:bg-slate-800 transition-colors">
            <Pencil size={14} />
          </button>
          <button onClick={() => requestDeleteColumn(columnId)} className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-slate-800 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Konten Task */}
      <div className="flex-1 p-3 pt-0 overflow-y-auto custom-scrollbar min-h-[150px] z-10">
        <Droppable droppableId={columnId}>
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`flex flex-col gap-3 min-h-[100px] transition-colors duration-200 ${
                snapshot.isDraggingOver ? 'bg-slate-800/20 rounded-xl' : ''
              }`}
            >
              {column.items.map((item, index) => (
                <TaskCard 
                  key={item.id} 
                  task={item} 
                  index={index} 
                  columnId={columnId}
                  openEditTask={openEditTask}
                  requestDeleteTask={requestDeleteTask}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <button 
          onClick={() => openAddTask(columnId)} 
          className="w-full mt-3 py-2 flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-blue-400 hover:bg-slate-800/80 rounded-lg transition-colors border border-transparent hover:border-slate-700 border-dashed"
        >
          <Plus size={16} /> New Task
        </button>
      </div>
    </div>
  );
};

export default Column;