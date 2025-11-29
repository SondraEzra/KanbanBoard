import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DeleteModal = ({ isOpen, type, title, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10000 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-sm p-6 transform scale-100">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle size={32} className="text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Are you sure?</h3>
          <p className="text-slate-400 text-sm mb-6">
            You are about to delete {type === 'column' ? 'column' : 'task'} <span className="text-slate-200 font-semibold">"{title}"</span>.
            {type === 'column' && " This will also delete all tasks inside it."}
            <br />This action cannot be undone.
          </p>
          <div className="flex gap-3 w-full">
            <button onClick={onClose} className="flex-1 py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl font-medium transition-colors">
              Cancel
            </button>
            <button onClick={onConfirm} className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-red-500/20">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;