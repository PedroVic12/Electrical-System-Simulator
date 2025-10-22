export class GenerationSource {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.description = data.description || '';
    this.percentage = data.percentage || 0;
    this.color = data.color || '#06b6d4';
    this.order_position = data.order_position || 0;
    this.created_at = data.created_at || null;
    this.updated_at = data.updated_at || null;
  }

  validate() {
    const errors = [];
    if (!this.name || this.name.trim() === '') {
      errors.push('Nome é obrigatório');
    }
    if (!this.description || this.description.trim() === '') {
      errors.push('Descrição é obrigatória');
    }
    if (this.percentage < 0 || this.percentage > 100) {
      errors.push('Porcentagem deve estar entre 0 e 100');
    }
    return errors;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      percentage: this.percentage,
      color: this.color,
      order_position: this.order_position,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  static fromJSON(data) {
    return new GenerationSource(data);
  }
}
