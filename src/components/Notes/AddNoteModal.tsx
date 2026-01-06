import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface AddNoteModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface Client {
  id: string;
  full_name: string;
}

export function AddNoteModal({ onClose, onSuccess }: AddNoteModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState({
    client_id: '',
    content: '',
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('clients')
      .select('id, full_name')
      .eq('user_id', user.id)
      .order('full_name');

    if (!error && data) {
      setClients(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const { error } = await supabase.from('notes').insert({
        user_id: user.id,
        ...formData,
      });

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Ошибка при добавлении заметки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Добавить задание</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">
              Клиент <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.client_id}
              onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            >
              <option value="">Выберите клиента</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.full_name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-2">Текст задания</label>
            <textarea
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
              placeholder="Введите текст задания..."
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-red-500 hover:text-red-600 text-sm flex items-center gap-2"
            >
              <span>←</span>
              <span>отмена</span>
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
