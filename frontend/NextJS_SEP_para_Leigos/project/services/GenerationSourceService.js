import { supabase } from '@/lib/supabase';
import { GenerationSource } from '@/models/GenerationSource';

export class GenerationSourceService {
  static tableName = 'generation_sources';

  static async getAll() {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .order('order_position', { ascending: true });

      if (error) throw error;
      return data.map(item => GenerationSource.fromJSON(item));
    } catch (error) {
      console.error('Error fetching generation sources:', error);
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
      return data ? GenerationSource.fromJSON(data) : null;
    } catch (error) {
      console.error('Error fetching generation source:', error);
      throw error;
    }
  }

  static async create(generationSource) {
    try {
      const errors = generationSource.validate();
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      const dataToInsert = { ...generationSource.toJSON() };
      delete dataToInsert.id;
      delete dataToInsert.created_at;
      delete dataToInsert.updated_at;

      const { data, error } = await supabase
        .from(this.tableName)
        .insert([dataToInsert])
        .select()
        .single();

      if (error) throw error;
      return GenerationSource.fromJSON(data);
    } catch (error) {
      console.error('Error creating generation source:', error);
      throw error;
    }
  }

  static async update(id, generationSource) {
    try {
      const errors = generationSource.validate();
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      const dataToUpdate = { ...generationSource.toJSON() };
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
      return GenerationSource.fromJSON(data);
    } catch (error) {
      console.error('Error updating generation source:', error);
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
      console.error('Error deleting generation source:', error);
      throw error;
    }
  }
}
