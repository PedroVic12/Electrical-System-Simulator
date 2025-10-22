import { supabase } from '@/lib/supabase';
import { SystemComponent } from '@/models/SystemComponent';

export class SystemComponentService {
  static tableName = 'system_components';

  static async getAll() {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .order('order_position', { ascending: true });

      if (error) throw error;
      return data.map(item => SystemComponent.fromJSON(item));
    } catch (error) {
      console.error('Error fetching system components:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data ? SystemComponent.fromJSON(data) : null;
    } catch (error) {
      console.error('Error fetching system component:', error);
      throw error;
    }
  }

  static async getByCategory(category) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('category', category)
        .order('order_position', { ascending: true });

      if (error) throw error;
      return data.map(item => SystemComponent.fromJSON(item));
    } catch (error) {
      console.error('Error fetching system components by category:', error);
      throw error;
    }
  }

  static async create(systemComponent) {
    try {
      const errors = systemComponent.validate();
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      const dataToInsert = { ...systemComponent.toJSON() };
      delete dataToInsert.id;
      delete dataToInsert.created_at;
      delete dataToInsert.updated_at;

      const { data, error } = await supabase
        .from(this.tableName)
        .insert([dataToInsert])
        .select()
        .single();

      if (error) throw error;
      return SystemComponent.fromJSON(data);
    } catch (error) {
      console.error('Error creating system component:', error);
      throw error;
    }
  }

  static async update(id, systemComponent) {
    try {
      const errors = systemComponent.validate();
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      const dataToUpdate = { ...systemComponent.toJSON() };
      delete dataToUpdate.id;
      delete dataToUpdate.created_at;
      dataToUpdate.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from(this.tableName)
        .update(dataToUpdate)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return SystemComponent.fromJSON(data);
    } catch (error) {
      console.error('Error updating system component:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting system component:', error);
      throw error;
    }
  }
}
