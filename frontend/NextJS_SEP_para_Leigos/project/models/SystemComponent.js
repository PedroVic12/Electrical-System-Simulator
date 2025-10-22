export class SystemComponent {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.description = data.description || '';
    this.category = data.category || 'general';
    this.icon = data.icon || 'box';
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
    const validCategories = ['generation', 'transmission', 'distribution', 'general'];
    if (!validCategories.includes(this.category)) {
      errors.push('Categoria inválida');
    }
    return errors;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      category: this.category,
      icon: this.icon,
      order_position: this.order_position,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  static fromJSON(data) {
    return new SystemComponent(data);
  }
}
