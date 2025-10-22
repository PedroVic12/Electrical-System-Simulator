export class EducationalContent {
  constructor(data = {}) {
    this.id = data.id || null;
    this.section = data.section || '';
    this.title = data.title || '';
    this.content = data.content || '';
    this.order_position = data.order_position || 0;
    this.created_at = data.created_at || null;
    this.updated_at = data.updated_at || null;
  }

  validate() {
    const errors = [];
    if (!this.section || this.section.trim() === '') {
      errors.push('Seção é obrigatória');
    }
    if (!this.title || this.title.trim() === '') {
      errors.push('Título é obrigatório');
    }
    if (!this.content || this.content.trim() === '') {
      errors.push('Conteúdo é obrigatório');
    }
    const validSections = ['transmission', 'distribution'];
    if (!validSections.includes(this.section)) {
      errors.push('Seção inválida');
    }
    return errors;
  }

  toJSON() {
    return {
      id: this.id,
      section: this.section,
      title: this.title,
      content: this.content,
      order_position: this.order_position,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  static fromJSON(data) {
    return new EducationalContent(data);
  }
}
