import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx"; // Se for usar MDX para mais funcionalidades

export default defineConfig({
  integrations: [tailwind(), mdx()],
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