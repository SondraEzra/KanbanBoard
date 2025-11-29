import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { Columns } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import Column from '../components/Column';
import FormModal from '../components/Modals/FormModal';
import DeleteModal from '../components/Modals/DeleteModal';

// --- INITIAL DATA & CONSTANTS ---
const initialData = {
  todo: { title: 'To Do', color: 'bg-pink-500', items: [{ id: uuidv4(), content: 'Setup Project React', priority: 'High', date: '12 Des' }] },
  inProgress: { title: 'In Progress', color: 'bg-blue-500', items: [{ id: uuidv4(), content: 'Membuat Komponen Utama', priority: 'Medium', date: '14 Des' }] },
  done: { title: 'Done', color: 'bg-emerald-500', items: [] },
};

const COLUMN_COLORS = [
  { name: 'Pink', value: 'bg-pink-500' },
  { name: 'Blue', value: 'bg-blue-500' },
  { name: 'Emerald', value: 'bg-emerald-500' },
  { name: 'Purple', value: 'bg-purple-500' },
  { name: 'Orange', value: 'bg-orange-500' },
  { name: 'Cyan', value: 'bg-cyan-500' },
];

const KanbanBoard = () => {
  // --- STATE ---
  const [columns, setColumns] = useState(() => {
    const saved = localStorage.getItem('kanban-board');
    return saved ? JSON.parse(saved) : initialData;
  });
  const [activeCol, setActiveCol] = useState(null);

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formType, setFormType] = useState('task'); 
  const [isEditing, setIsEditing] = useState(false);
  
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: null, id: null, parentId: null, title: '' });
  
  // Data States for Forms
  const [targetId, setTargetId] = useState(null); 
  const [parentId, setParentId] = useState(null);
  const [inputTitle, setInputTitle] = useState('');
  const [inputPriority, setInputPriority] = useState('Low');
  const [inputColor, setInputColor] = useState(COLUMN_COLORS[0].value);

  // --- EFFECTS ---
  useEffect(() => {
    localStorage.setItem('kanban-board', JSON.stringify(columns));
  }, [columns]);

  // --- DRAG HANDLERS ---
  const onDragStart = (start) => setActiveCol(start.source.droppableId);

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
      
      setColumns({ ...columns, [source.droppableId]: { ...sourceCol, items: sourceItems }, [destination.droppableId]: { ...destCol, items: destItems } });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({ ...columns, [source.droppableId]: { ...column, items: copiedItems } });
    }
  };

  // --- ACTIONS: OPEN MODALS ---
  const openAddTask = (columnId) => {
    setFormType('task'); setIsEditing(false); setParentId(columnId); setInputTitle(''); setInputPriority('Low'); setIsFormModalOpen(true);
  };

  const openEditTask = (columnId, task) => {
    setFormType('task'); setIsEditing(true); setParentId(columnId); setTargetId(task.id); setInputTitle(task.content); setInputPriority(task.priority); setIsFormModalOpen(true);
  };

  const openAddColumn = () => {
    setFormType('column'); setIsEditing(false); setInputTitle(''); setInputColor(COLUMN_COLORS[0].value); setIsFormModalOpen(true);
  };

  const openEditColumn = (columnId) => {
    setFormType('column'); setIsEditing(true); setTargetId(columnId); setInputTitle(columns[columnId].title); setInputColor(columns[columnId].color); setIsFormModalOpen(true);
  };

  // --- ACTIONS: DELETE ---
  const requestDeleteColumn = (columnId) => {
    setDeleteModal({ isOpen: true, type: 'column', id: columnId, title: columns[columnId].title });
  };

  const requestDeleteTask = (columnId, task) => {
    setDeleteModal({ isOpen: true, type: 'task', id: task.id, parentId: columnId, title: task.content });
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

  // --- ACTIONS: SAVE FORM ---
  const handleSave = (e) => {
    e.preventDefault();
    if (!inputTitle.trim()) return;

    if (formType === 'task') {
      const column = columns[parentId];
      let newItems;
      if (isEditing) {
        newItems = column.items.map(item => item.id === targetId ? { ...item, content: inputTitle, priority: inputPriority } : item);
      } else {
        const newTask = { id: uuidv4(), content: inputTitle, priority: inputPriority, date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) };
        newItems = [...column.items, newTask];
      }
      setColumns({ ...columns, [parentId]: { ...column, items: newItems } });
    } else {
      if (isEditing) {
        setColumns({ ...columns, [targetId]: { ...columns[targetId], title: inputTitle, color: inputColor } });
      } else {
        const newId = uuidv4();
        setColumns({ ...columns, [newId]: { title: inputTitle, color: inputColor, items: [] } });
      }
    }
    setIsFormModalOpen(false);
  };

  const columnEntries = Object.entries(columns);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-slate-900 to-black text-slate-200 p-4 font-sans selection:bg-blue-500/30">
      <header className="flex justify-between items-center mb-6 w-full px-2">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-400">Kanban Board</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your task here</p>
        </div>
        <div className="flex items-center gap-6">
            <button onClick={openAddColumn} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5">
                <Columns size={18} /><span>Add Column</span>
            </button>
        </div>
      </header>
      
      <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-8 w-full h-[calc(100vh-140px)] items-start custom-scrollbar">
        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
          {columnEntries.map(([columnId, column], index) => (
            <Column 
              key={columnId}
              columnId={columnId}
              column={column}
              isActive={activeCol === columnId}
              isFirst={index === 0}
              isLast={index === columnEntries.length - 1}
              openEditColumn={openEditColumn}
              requestDeleteColumn={requestDeleteColumn}
              openEditTask={openEditTask}
              requestDeleteTask={requestDeleteTask}
              openAddTask={openAddTask}
            />
          ))}
        </DragDropContext>
      </div>

      <FormModal 
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSave}
        formType={formType}
        isEditing={isEditing}
        title={inputTitle}
        setTitle={setInputTitle}
        priority={inputPriority}
        setPriority={setInputPriority}
        color={inputColor}
        setColor={setInputColor}
        columnColors={COLUMN_COLORS}
      />

      <DeleteModal 
        isOpen={deleteModal.isOpen}
        type={deleteModal.type}
        title={deleteModal.title}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default KanbanBoard;