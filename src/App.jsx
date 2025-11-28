import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, Trash2, Calendar, MoreHorizontal } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

// Data awal
const initialData = {
  todo: {
    title: 'To Do',
    color: 'bg-pink-500', 
    items: [],
  },
  inProgress: {
    title: 'In Progress',
    color: 'bg-blue-500',
    items: [],
  },
  done: {
    title: 'Done',
    color: 'bg-emerald-500',
    items: [],
  },
};

const PriorityBadge = ({ level }) => {
  const colors = {
    High: 'bg-red-500/10 text-red-400 border-red-500/20',
    Medium: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${colors[level] || colors.Low} font-medium`}>
      {level}
    </span>
  );
};

function App() {
  const [columns, setColumns] = useState(() => {
    const saved = localStorage.getItem('kanban-board');
    return saved ? JSON.parse(saved) : initialData;
  });

  // STATE BARU: Menyimpan ID kolom tempat kartu berasal saat sedang di-drag
  const [activeCol, setActiveCol] = useState(null);

  useEffect(() => {
    localStorage.setItem('kanban-board', JSON.stringify(columns));
  }, [columns]);

  // Handler saat drag dimulai
  const onDragStart = (start) => {
    // Catat kolom mana yang sedang aktif (sumber drag)
    setActiveCol(start.source.droppableId);
  };

  const onDragEnd = (result) => {
    // Reset status kolom aktif
    setActiveCol(null);

    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceCol = columns[source.droppableId];
      const destCol = columns[destination.droppableId];
      const sourceItems = [...sourceCol.items];
      const destItems = [...destCol.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      
      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceCol, items: sourceItems },
        [destination.droppableId]: { ...destCol, items: destItems },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({ ...columns, [source.droppableId]: { ...column, items: copiedItems } });
    }
  };

  const addTask = (columnId) => {
    const text = prompt("Nama tugas baru:");
    if (!text) return;
    
    const priorities = ['High', 'Medium', 'Low'];
    const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
    
    const newMc = { 
      id: uuidv4(), 
      content: text, 
      priority: randomPriority, 
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    };
    
    const column = columns[columnId];
    setColumns({
      ...columns,
      [columnId]: { ...column, items: [...column.items, newMc] },
    });
  };

  const deleteTask = (columnId, index) => {
    if (!confirm("Hapus tugas ini?")) return;
    const column = columns[columnId];
    const newItems = [...column.items];
    newItems.splice(index, 1);
    setColumns({ ...columns, [columnId]: { ...column, items: newItems } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-slate-200 p-8 font-sans selection:bg-blue-500/30">
      
      <header className="flex justify-between items-center mb-10 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Project Board
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage your internship portfolio projects</p>
        </div>
        <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border-2 border-slate-800"></div>
            <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center text-xs">+3</div>
        </div>
      </header>
      
      <div className="flex flex-col md:flex-row gap-8 overflow-x-auto pb-4 max-w-7xl mx-auto h-[calc(100vh-150px)] justify-between">
        {/* Tambahkan onDragStart di sini */}
        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
          {Object.entries(columns).map(([columnId, column]) => (
            <div 
              key={columnId} 
              // LOGIKA KUNCI: 
              // Jika kolom ini adalah kolom asal (activeCol === columnId), berikan z-index 50 agar naik ke paling atas.
              // Jika tidak, biarkan z-0 (default).
              className={`flex-shrink-0 w-full md:w-80 flex flex-col relative transition-all duration-200 ${
                activeCol === columnId ? 'z-50' : 'z-0'
              }`}
            >
              {/* Background Layer */}
              <div className="absolute inset-0 bg-slate-900/50 rounded-2xl border border-slate-800/50 backdrop-blur-sm shadow-xl -z-10 pointer-events-none" />

              {/* Header */}
              <div className="flex justify-between items-center p-4 pb-2 z-10">
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                    <h2 className="font-semibold text-slate-200 tracking-wide">{column.title}</h2>
                    <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full border border-slate-700">
                        {column.items.length}
                    </span>
                </div>
                <MoreHorizontal size={18} className="text-slate-600 cursor-pointer hover:text-slate-400" />
              </div>

              {/* Konten */}
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
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`
                                group relative bg-slate-800 p-4 rounded-xl border border-slate-700/60 shadow-sm 
                                hover:shadow-lg hover:border-slate-500 hover:translate-y-[-2px] transition-all duration-200
                                ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-blue-500/50 rotate-2 z-[9999] cursor-grabbing' : 'cursor-grab'}
                              `}
                              style={{ ...provided.draggableProps.style }}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <PriorityBadge level={item.priority || 'Low'} />
                                <button 
                                    onClick={(e) => { e.stopPropagation(); deleteTask(columnId, index); }}
                                    className="text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-rose-500/10"
                                >
                                    <Trash2 size={14} />
                                </button>
                              </div>

                              <p className="text-slate-200 font-medium text-sm mb-3 leading-snug">
                                {item.content}
                              </p>

                              <div className="flex justify-between items-center pt-3 border-t border-slate-700/50">
                                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                                    <Calendar size={12} />
                                    <span>{item.date || 'Today'}</span>
                                </div>
                                <div className="flex -space-x-2">
                                    <div className="w-6 h-6 rounded-full bg-indigo-500 border border-slate-800"></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                <button 
                  onClick={() => addTask(columnId)}
                  className="w-full mt-3 py-2 flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-blue-400 hover:bg-slate-800/80 rounded-lg transition-colors border border-transparent hover:border-slate-700 border-dashed"
                >
                  <Plus size={16} /> New Task
                </button>
              </div>
            </div>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;