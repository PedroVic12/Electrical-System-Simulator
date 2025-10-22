import { signal, computed } from '@preact/signals-react';
import { GenerationSourceService } from '@/services/GenerationSourceService';
import { SystemComponentService } from '@/services/SystemComponentService';
import { EducationalContentService } from '@/services/EducationalContentService';

export const generationSources = signal([]);
export const systemComponents = signal([]);
export const educationalContent = signal([]);
export const loading = signal(false);
export const error = signal(null);
export const activeSection = signal(null);
export const selectedComponent = signal(null);
export const selectedTab = signal(0);

export const transmissionContent = computed(() =>
  educationalContent.value.filter(item => item.section === 'transmission')
);

export const distributionContent = computed(() =>
  educationalContent.value.filter(item => item.section === 'distribution')
);

export const chartData = computed(() => {
  return generationSources.value.map(source => ({
    name: source.name,
    value: parseFloat(source.percentage),
    color: source.color
  }));
});

export const powerSystemActions = {
  async loadGenerationSources() {
    try {
      loading.value = true;
      error.value = null;
      const data = await GenerationSourceService.getAll();
      generationSources.value = data;
    } catch (err) {
      error.value = err.message;
      console.error('Error loading generation sources:', err);
    } finally {
      loading.value = false;
    }
  },

  async loadSystemComponents() {
    try {
      loading.value = true;
      error.value = null;
      const data = await SystemComponentService.getAll();
      systemComponents.value = data;
    } catch (err) {
      error.value = err.message;
      console.error('Error loading system components:', err);
    } finally {
      loading.value = false;
    }
  },

  async loadEducationalContent() {
    try {
      loading.value = true;
      error.value = null;
      const data = await EducationalContentService.getAll();
      educationalContent.value = data;
    } catch (err) {
      error.value = err.message;
      console.error('Error loading educational content:', err);
    } finally {
      loading.value = false;
    }
  },

  async createGenerationSource(data) {
    try {
      loading.value = true;
      error.value = null;
      const newSource = await GenerationSourceService.create(data);
      generationSources.value = [...generationSources.value, newSource];
      return newSource;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  },

  async updateGenerationSource(id, data) {
    try {
      loading.value = true;
      error.value = null;
      const updated = await GenerationSourceService.update(id, data);
      generationSources.value = generationSources.value.map(item =>
        item.id === id ? updated : item
      );
      return updated;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  },

  async deleteGenerationSource(id) {
    try {
      loading.value = true;
      error.value = null;
      await GenerationSourceService.delete(id);
      generationSources.value = generationSources.value.filter(item => item.id !== id);
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  },

  async createSystemComponent(data) {
    try {
      loading.value = true;
      error.value = null;
      const newComponent = await SystemComponentService.create(data);
      systemComponents.value = [...systemComponents.value, newComponent];
      return newComponent;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  },

  async updateSystemComponent(id, data) {
    try {
      loading.value = true;
      error.value = null;
      const updated = await SystemComponentService.update(id, data);
      systemComponents.value = systemComponents.value.map(item =>
        item.id === id ? updated : item
      );
      return updated;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  },

  async deleteSystemComponent(id) {
    try {
      loading.value = true;
      error.value = null;
      await SystemComponentService.delete(id);
      systemComponents.value = systemComponents.value.filter(item => item.id !== id);
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  },

  async createEducationalContent(data) {
    try {
      loading.value = true;
      error.value = null;
      const newContent = await EducationalContentService.create(data);
      educationalContent.value = [...educationalContent.value, newContent];
      return newContent;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  },

  async updateEducationalContent(id, data) {
    try {
      loading.value = true;
      error.value = null;
      const updated = await EducationalContentService.update(id, data);
      educationalContent.value = educationalContent.value.map(item =>
        item.id === id ? updated : item
      );
      return updated;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  },

  async deleteEducationalContent(id) {
    try {
      loading.value = true;
      error.value = null;
      await EducationalContentService.delete(id);
      educationalContent.value = educationalContent.value.filter(item => item.id !== id);
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  },

  setActiveSection(section) {
    activeSection.value = activeSection.value === section ? null : section;
  },

  setSelectedComponent(component) {
    selectedComponent.value = component;
  },

  setSelectedTab(index) {
    selectedTab.value = index;
  },

  async loadAllData() {
    await Promise.all([
      this.loadGenerationSources(),
      this.loadSystemComponents(),
      this.loadEducationalContent()
    ]);
  }
};
