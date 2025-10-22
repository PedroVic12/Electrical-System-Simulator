'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useSignals } from '@preact/signals-react/runtime';

export default function AdminPanel({
  isOpen,
  onClose,
  onCreateSource,
  onUpdateSource,
  onDeleteSource,
  onCreateComponent,
  onUpdateComponent,
  onDeleteComponent,
  sources,
  components
}) {
  useSignals();

  const [activeTab, setActiveTab] = useState('sources');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    percentage: 0,
    color: '#06b6d4',
    category: 'general',
    icon: 'box'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (activeTab === 'sources') {
        const sourceData = {
          name: formData.name,
          description: formData.description,
          percentage: parseFloat(formData.percentage),
          color: formData.color,
          order_position: sources.length
        };

        if (editingItem) {
          await onUpdateSource(editingItem.id, sourceData);
        } else {
          await onCreateSource(sourceData);
        }
      } else {
        const componentData = {
          name: formData.name,
          description: formData.description,
          category: formData.category,
          icon: formData.icon,
          order_position: components.length
        };

        if (editingItem) {
          await onUpdateComponent(editingItem.id, componentData);
        } else {
          await onCreateComponent(componentData);
        }
      }

      resetForm();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Erro ao salvar: ' + error.message);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      percentage: item.percentage || 0,
      color: item.color || '#06b6d4',
      category: item.category || 'general',
      icon: item.icon || 'box'
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;

    try {
      if (activeTab === 'sources') {
        await onDeleteSource(id);
      } else {
        await onDeleteComponent(id);
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Erro ao excluir: ' + error.message);
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      percentage: 0,
      color: '#06b6d4',
      category: 'general',
      icon: 'box'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-slate-800">Painel Administrativo</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('sources')}
            className={`flex-1 py-3 px-4 font-medium transition-colors ${
              activeTab === 'sources'
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Fontes de Geração
          </button>
          <button
            onClick={() => setActiveTab('components')}
            className={`flex-1 py-3 px-4 font-medium transition-colors ${
              activeTab === 'components'
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Componentes do Sistema
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-slate-800">
                {editingItem ? 'Editar' : 'Adicionar Novo'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    required
                  />
                </div>

                {activeTab === 'sources' ? (
                  <>
                    <div>
                      <Label htmlFor="percentage">Porcentagem (%)</Label>
                      <Input
                        id="percentage"
                        type="number"
                        step="0.01"
                        value={formData.percentage}
                        onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="color">Cor</Label>
                      <Input
                        id="color"
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Label htmlFor="category">Categoria</Label>
                      <select
                        id="category"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="general">Geral</option>
                        <option value="generation">Geração</option>
                        <option value="transmission">Transmissão</option>
                        <option value="distribution">Distribuição</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="icon">Ícone (Lucide React)</Label>
                      <Input
                        id="icon"
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        placeholder="zap, box, cable..."
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    <Plus className="w-4 h-4 mr-2" />
                    {editingItem ? 'Atualizar' : 'Adicionar'}
                  </Button>
                  {editingItem && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancelar
                    </Button>
                  )}
                </div>
              </form>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-slate-800">
                {activeTab === 'sources' ? 'Fontes Cadastradas' : 'Componentes Cadastrados'}
              </h3>
              <div className="space-y-2">
                {(activeTab === 'sources' ? sources : components).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-800">{item.name}</h4>
                      <p className="text-sm text-slate-600 truncate">{item.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
