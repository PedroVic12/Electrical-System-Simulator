// ============================================================================
// DATABASE CONTROLLER - Controlador de acesso aos dados
// ============================================================================

class DatabaseController {
  constructor() {
    this.model = null
    this.notesCache = new Map()
  }

  /**
   * Inicializa o controller com o modelo de dados
   */
  async init(model) {
    this.model = model
    return this
  }

  /**
   * Busca o conteúdo de uma nota em Markdown
   * @param {string} notePath - Caminho para o arquivo .md
   * @returns {Promise<string>} - Conteúdo do arquivo
   */
  async fetchNoteContent(notePath) {
    // Verifica se já está em cache
    if (this.notesCache.has(notePath)) {
      return this.notesCache.get(notePath)
    }

    try {
      const response = await fetch(notePath)
      if (!response.ok) {
        throw new Error(`Erro ao carregar nota: ${response.statusText}`)
      }
      const content = await response.text()
      
      // Armazena em cache
      this.notesCache.set(notePath, content)
      
      return content
    } catch (error) {
      console.error('Erro ao buscar nota:', error)
      return null
    }
  }

  /**
   * Converte Markdown para HTML simples
   * @param {string} markdown - Texto em Markdown
   * @returns {string} - HTML convertido
   */
  markdownToHtml(markdown) {
    if (!markdown) return ''

    let html = markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      // Lists
      .replace(/^\- (.*$)/gim, '<li class="ml-4">• $1</li>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p class="mb-4">')

    return `<div class="markdown-content"><p class="mb-4">${html}</p></div>`
  }

  /**
   * Obtém dados de geração com conteúdo das notas
   * @param {string} id - ID do tipo de geração
   * @returns {Promise<Object>} - Dados completos com nota
   */
  async getGenerationWithNote(id) {
    const generation = this.model.getGenerationById(id)
    if (!generation) return null

    const noteContent = await this.fetchNoteContent(generation.notePath)
    const noteHtml = this.markdownToHtml(noteContent)

    return {
      ...generation,
      noteContent,
      noteHtml
    }
  }

  /**
   * Obtém todos os dados de geração
   * @returns {Array} - Lista de tipos de geração
   */
  getAllGenerationData() {
    return this.model.getGenerationData()
  }

  /**
   * Obtém todos os componentes
   * @returns {Array} - Lista de componentes
   */
  getAllComponents() {
    return this.model.getComponentsData()
  }

  /**
   * Obtém um componente por ID
   * @param {string} id - ID do componente
   * @returns {Object} - Dados do componente
   */
  getComponentById(id) {
    return this.model.getComponentById(id)
  }

  /**
   * Obtém todos os sites externos
   * @returns {Object} - Objeto com sites externos
   */
  getExternalSites() {
    return this.model.getExternalSites()
  }

  /**
   * Obtém dados do gráfico
   * @returns {Object} - Dados para Chart.js
   */
  getChartData() {
    return this.model.getChartData()
  }

  /**
   * Limpa o cache de notas
   */
  clearCache() {
    this.notesCache.clear()
  }

  /**
   * Pré-carrega todas as notas
   * @returns {Promise<void>}
   */
  async preloadNotes() {
    const generationData = this.getAllGenerationData()
    const promises = generationData.map(item => 
      this.fetchNoteContent(item.notePath)
    )
    await Promise.all(promises)
    console.log('✅ Todas as notas foram pré-carregadas')
  }
}

// Exportar para uso
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DatabaseController
}
