import { defineConfig } from 'astro/config';
// import mdx from "@astrojs/mdx"; // Se for usar MDX para mais funcionalidades

export default defineConfig({
  integrations: [],
  markdown: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
  // Configuração para coleções de conteúdo (content collections)
  // Isso é opcional, mas útil para tipagem e validação
  collections: {
    notes: {
      type: 'content',
      schema: ({ z }) => z.object({
        title: z.string(),
        description: z.string(),
      }),
    },
  },
});