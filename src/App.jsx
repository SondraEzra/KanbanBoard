import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, Trash2, Calendar, MoreHorizontal, X, Check, Pencil, Layout, AlertTriangle, Columns } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';


const initialData = {
  todo: {
    title: 'To Do',
    color: 'bg-pink-500', 
    items: [
      { id: uuidv4(), content: 'Setup Project React', priority: 'High', date: '12 Des' },
    ],
  },
  inProgress: {
    title: 'In Progress',
    color: 'bg-blue-500',
    items: [
      { id: uuidv4(), content: 'Membuat Komponen Utama', priority: 'Medium', date: '14 Des' },
    ],
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

const COLUMN_COLORS = [
  { name: 'Pink', value: 'bg-pink-500' },
  { name: 'Blue', value: 'bg-blue-500' },
  { name: 'Emerald', value: 'bg-emerald-500' },
  { name: 'Purple', value: 'bg-purple-500' },
  { name: 'Orange', value: 'bg-orange-500' },
  { name: 'Cyan', value: 'bg-cyan-500' },
];

function App() {
  const [columns, setColumns] = useState(() => {
    const saved = localStorage.getItem('kanban-board');
    return saved ? JSON.parse(saved) : initialData;
  });

  
  const [activeCol, setActiveCol] = useState(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formType, setFormType] = useState('task');
  const [isEditing, setIsEditing] = useState(false);
  
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: null,
    id: null,
    parentId: null, 
    title: '' 
  });
  
  const [targetId, setTargetId] = useState(null); 
  const [parentId, setParentId] = useState(null);
  const [inputTitle, setInputTitle] = useState('');
  const [inputPriority, setInputPriority] = useState('Low');
  const [inputColor, setInputColor] = useState(COLUMN_COLORS[0].value);

  useEffect(() => {
    localStorage.setItem('kanban-board', JSON.stringify(columns));
  }, [columns]);

 
  const onDragStart = (start) => {setActiveCol(start.source.droppableId);};

  const onDragEnd = (result) => {

    setActiveCol(null);

    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

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

  const openAddTask = (columnId) => {
    setFormType('task');
    setIsEditing(false);
    setParentId(columnId);
    setInputTitle('');
    setInputPriority('Low');
    setIsFormModalOpen(true);
  };

  const openEditTask = (columnId, task) => {
    setFormType('task');
    setIsEditing(true);
    setParentId(columnId);
    setTargetId(task.id);
    setInputTitle(task.content);
    setInputPriority(task.priority);
    setIsFormModalOpen(true);
  };

  const openAddColumn = () => {
    setFormType('column');
    setIsEditing(false);
    setInputTitle('');
    setInputColor(COLUMN_COLORS[0].value);
    setIsFormModalOpen(true);
  };

  const openEditColumn = (columnId) => {
    setFormType('column');
    setIsEditing(true);
    setTargetId(columnId);
    setInputTitle(columns[columnId].title);
    setInputColor(columns[columnId].color);
    setIsFormModalOpen(true);
  };

  const requestDeleteColumn = (columnId) => {
    setDeleteModal({
      isOpen: true,
      type: 'column',
      id: columnId,
      title: columns[columnId].title
    });
  };

  const requestDeleteTask = (columnId, task) => {
    setDeleteModal({
      isOpen: true,
      type: 'task',
      id: task.id,
      parentId: columnId,
      title: task.content
    });
  };

  const confirmDelete = () => {
    const { type, id, parentId } = deleteModal;
    if (type === 'column') {
      const newColumns = { ...columns };
      delete newColumns[id];
      setColumns(newColumns);
    } else if (type === 'task') {
      const column = columns[parentId];
      const newItems = column.items.filter((item) => item.id !== id);
      setColumns({ ...columns, [parentId]: { ...column, items: newItems } });
    }
    setDeleteModal({ ...deleteModal, isOpen: false });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!inputTitle.trim()) return;

    if (formType === 'task') {
      const column = columns[parentId];
      let newItems;
      if (isEditing) {
        newItems = column.items.map(item => 
          item.id === targetId ? { ...item, content: inputTitle, priority: inputPriority } : item
        );
      } else {
        const newTask = { 
          id: uuidv4(), 
          content: inputTitle, 
          priority: inputPriority, 
          date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
        };
        newItems = [...column.items, newTask];
      }
      setColumns({ ...columns, [parentId]: { ...column, items: newItems } });
    } else {
      if (isEditing) {
        setColumns({
          ...columns,
          [targetId]: { ...columns[targetId], title: inputTitle, color: inputColor }
        });
      } else {
        const newId = uuidv4();
        setColumns({
          ...columns,
          [newId]: { title: inputTitle, color: inputColor, items: [] }
        });
      }
    }
    setIsFormModalOpen(false);
  };

  const columnEntries = Object.entries(columns);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-slate-900 to-black text-slate-200 p-8 font-sans selection:bg-blue-500/30">
      
      <header className="flex justify-between items-center mb-6 w-full px-2">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-400">
            Kanban Board
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage your task here</p>
        </div>
        
        <div className="flex items-center gap-6">
            <button 
                onClick={openAddColumn}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5"
            >
                <Columns size={18} />
                <span>Add Column</span>
            </button>
        </div>
      </header>
      
      <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-8 w-full h-[calc(100vh-140px)] items-start custom-scrollbar mt-15">
        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
          
          {columnEntries.map(([columnId, column], index) => (
            <div 
              key={columnId} 
              className={`shrink-0 w-full md:w-80 flex flex-col relative transition-all duration-200 
                ${activeCol === columnId ? 'z-50' : 'z-0'}
                ${index === 0 ? 'md:ml-auto' : ''} 
                ${index === columnEntries.length - 1 ? 'md:mr-auto' : ''}
              `}
            >
              <div className="absolute inset-0 bg-slate-900/50 rounded-2xl border border-slate-800/50 backdrop-blur-sm shadow-xl -z-10 pointer-events-none" />

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
                                hover:shadow-lg hover:border-slate-500 hover:-translate-y-0.5 transition-all duration-200
                                ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-blue-500/50 rotate-2 z-9999 cursor-grabbing' : 'cursor-grab'}
                              `}
                              style={{ ...provided.draggableProps.style }}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <PriorityBadge level={item.priority || 'Low'} />
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={(e) => { e.stopPropagation(); openEditTask(columnId, item); }} className="text-slate-500 hover:text-blue-400 p-1 rounded hover:bg-blue-500/10 transition-colors">
                                      <Pencil size={14} />
                                  </button>
                                  <button onClick={(e) => { e.stopPropagation(); requestDeleteTask(columnId, item); }} className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-rose-500/10 transition-colors">
                                      <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                              <p className="text-slate-200 font-medium text-sm mb-3 leading-snug">{item.content}</p>
                              <div className="flex justify-between items-center pt-3 border-t border-slate-700/50">
                                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                                    <Calendar size={12} />
                                    <span>{item.date || 'Today'}</span>
                                </div>
                                <div className="w-6 h-6 rounded-full bg-indigo-500 border border-slate-800"></div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                <button onClick={() => openAddTask(columnId)} className="w-full mt-3 py-2 flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-blue-400 hover:bg-slate-800/80 rounded-lg transition-colors border border-transparent hover:border-slate-700 border-dashed">
                  <Plus size={16} /> New Task
                </button>
              </div>
            </div>
          ))}
          
        </DragDropContext>
      </div>

      {isFormModalOpen && (
        <div className="fixed inset-0 z-10000 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md p-6 transform scale-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                {formType === 'task' ? <Layout size={20} className="text-blue-400"/> : <MoreHorizontal size={20} className="text-purple-400"/>}
                {isEditing ? `Edit ${formType === 'task' ? 'Task' : 'Column'}` : `Add New ${formType === 'task' ? 'Task' : 'Column'}`}
              </h3>
              <button onClick={() => setIsFormModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-400 mb-2">
                    {formType === 'task' ? 'Task Content' : 'Column Name'}
                </label>
                <input 
                  autoFocus
                  type="text" 
                  value={inputTitle}
                  onChange={(e) => setInputTitle(e.target.value)}
                  placeholder={formType === 'task' ? "What needs to be done?" : "Add more progress stages?"}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                />
              </div>
              {formType === 'task' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-400 mb-2">Priority Level</label>
                  <div className="flex gap-2">
                    {['Low', 'Medium', 'High'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setInputPriority(p)}
                        className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                          inputPriority === p 
                            ? 'bg-blue-500/20 border-blue-500 text-blue-400' 
                            : 'bg-slate-900 border-slate-700 text-slate-500 hover:bg-slate-800'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {formType === 'column' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-400 mb-2">Column Color</label>
                  <div className="flex gap-3 flex-wrap">
                    {COLUMN_COLORS.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setInputColor(c.value)}
                        className={`w-8 h-8 rounded-full ${c.value} border-2 transition-transform hover:scale-110 ${
                          inputColor === c.value ? 'border-white scale-110 ring-2 ring-white/20' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              )}
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
                <Check size={18} /> Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-10000 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-sm p-6 transform scale-100">
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle size={32} className="text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Are you sure?</h3>
                    <p className="text-slate-400 text-sm mb-6">
                        You are about to delete {deleteModal.type === 'column' ? 'column' : 'task'} <span className="text-slate-200 font-semibold">"{deleteModal.title}"</span>. 
                        {deleteModal.type === 'column' && " This will also delete all tasks inside it."}
                        <br/>This action cannot be undone.
                    </p>
                    <div className="flex gap-3 w-full">
                        <button onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })} className="flex-1 py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl font-medium transition-colors">Cancel</button>
                        <button onClick={confirmDelete} className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-red-500/20">Delete</button>
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}

export default App;