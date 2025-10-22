import { supabase } from '@/lib/supabase';
import { EducationalContent } from '@/models/EducationalContent';

export class EducationalContentService {
  static tableName = 'educational_content';

  static async getAll() {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .order('section', { ascending: true })
        .order('order_position', { ascending: true });

      if (error) throw error;
      return data.map(item => EducationalContent.fromJSON(item));
    } catch (error) {
      console.error('Error fetching educational content:', error);
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
      return data ? EducationalContent.fromJSON(data) : null;
    } catch (error) {
      console.error('Error fetching educational content:', error);
      throw error;
    }
  }

  static async getBySection(section) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('section', section)
        .order('order_position', { ascending: true });

      if (error) throw error;
      return data.map(item => EducationalContent.fromJSON(item));
    } catch (error) {
      console.error('Error fetching educational content by section:', error);
      throw error;
    }
  }

  static async create(educationalContent) {
    try {
      const errors = educationalContent.validate();
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      const dataToInsert = { ...educationalContent.toJSON() };
      delete dataToInsert.id;
      delete dataToInsert.created_at;
      delete dataToInsert.updated_at;

      const { data, error } = await supabase
        .from(this.tableName)
        .insert([dataToInsert])
        .select()
        .single();

      if (error) throw error;
      return EducationalContent.fromJSON(data);
    } catch (error) {
      console.error('Error creating educational content:', error);
      throw error;
    }
  }

  static async update(id, educationalContent) {
    try {
      const errors = educationalContent.validate();
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      const dataToUpdate = { ...educationalContent.toJSON() };
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
      return EducationalContent.fromJSON(data);
    } catch (error) {
      console.error('Error updating educational content:', error);
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
      console.error('Error deleting educational content:', error);
      throw error;
    }
  }
}
