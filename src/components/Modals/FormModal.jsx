import React from 'react';
import { X, Check, Layout, MoreHorizontal } from 'lucide-react';

const FormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  formType, 
  isEditing, 
  title, 
  setTitle, 
  priority, 
  setPriority, 
  color, 
  setColor, 
  columnColors 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10000 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md p-6 transform scale-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            {formType === 'task' ? <Layout size={20} className="text-blue-400"/> : <MoreHorizontal size={20} className="text-purple-400"/>}
            {isEditing ? `Edit ${formType === 'task' ? 'Task' : 'Column'}` : `Add New ${formType === 'task' ? 'Task' : 'Column'}`}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-400 mb-2">
              {formType === 'task' ? 'Task Content' : 'Column Name'}
            </label>
            <input 
              autoFocus
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                      priority === p 
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
                {columnColors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setColor(c.value)}
                    className={`w-8 h-8 rounded-full ${c.value} border-2 transition-transform hover:scale-110 ${
                      color === c.value ? 'border-white scale-110 ring-2 ring-white/20' : 'border-transparent opacity-70 hover:opacity-100'
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
  );
};

export default FormModal;