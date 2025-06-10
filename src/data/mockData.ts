export const categories = [
  {
    id: '1',
    name: 'Technology',
    slug: 'technology',
    description: 'Latest tech news and innovations',
    color: '#3b82f6',
  },
  { id: '2', name: 'Business', slug: 'business', description: 'Business and finance updates', color: '#10b981' },
  { id: '3', name: 'Sports', slug: 'sports', description: 'Sports news and highlights', color: '#f59e0b' },
  { id: '4', name: 'Health', slug: 'health', description: 'Health and wellness updates', color: '#ef4444' },
  { id: '5', name: 'Politics', slug: 'politics', description: 'Political news and analysis', color: '#8b5cf6' },
  {
    id: '6',
    name: 'Entertainment',
    slug: 'entertainment',
    description: 'Entertainment and celebrity news',
    color: '#ec4899',
  },
]

export const sources = [
  {
    id: '1',
    name: 'TechCrunch',
    url: 'https://techcrunch.com',
    category: 'Technology',
    isActive: true,
    lastFetch: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Reuters',
    url: 'https://reuters.com',
    category: 'Business',
    isActive: true,
    lastFetch: '2024-01-15T10:25:00Z',
  },
  {
    id: '3',
    name: 'ESPN',
    url: 'https://espn.com',
    category: 'Sports',
    isActive: true,
    lastFetch: '2024-01-15T10:20:00Z',
  },
  { id: '4', name: 'WebMD', url: 'https://webmd.com', category: 'Health', isActive: false },
  { id: '5', name: 'Manual Submission', url: '', category: 'Various', isActive: true },
]

export const sampleArticles = {
  data: [
    {
      id: '1cc96c4d-5e26-4c20-9d60-dfbab62ba7e6',
      title: 'Artigo bueda fixe',
      summary: 'Sumário de um artigo fixe',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
      created_at: '2025-06-10T21:42:36.966042',
      updated_at: null,
      is_approved: true,
      source_id: null,
      url: null,
      article_authors: [
        {
          author_id: 'c1bdfe53-8f5b-4f29-b938-7244ed15a1bd',
          name: 'Bruna SIlvestre',
        },
      ],
      article_tags: [
        {
          tag_id: '9b498027-e0e7-4134-9731-d39485d649af',
          name: 'UBI',
        },
        {
          tag_id: '61687db4-80e9-47fc-b60a-f667fedbc8d1',
          name: 'Região',
        },
        {
          tag_id: '88eaba41-63d3-42c6-a3da-302f635b15e8',
          name: 'Made in UBI',
        },
      ],
    },
    {
      id: '2a7e9f3b-2b6a-4e8d-9c2e-1a2b3c4d5e6f',
      title: 'Descoberta Científica Revoluciona Medicina',
      summary: 'Investigadores portugueses desenvolvem tratamento inovador para doenças raras.',
      content:
        'Uma equipa da UBI anunciou um avanço significativo no tratamento de doenças raras, recorrendo a técnicas de engenharia genética de última geração...',
      created_at: '2025-06-09T14:22:10.123456',
      updated_at: null,
      is_approved: true,
      source_id: null,
      url: null,
      article_authors: [
        {
          author_id: 'd2e3f4a5-b6c7-8d9e-0f1a-2b3c4d5e6f7g',
          name: 'João Pereira',
        },
        {
          author_id: 'e3f4a5b6-c7d8-9e0f-1a2b-3c4d5e6f7g8h',
          name: 'Ana Costa',
        },
      ],
      article_tags: [
        {
          tag_id: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6',
          name: 'Ciência',
        },
        {
          tag_id: 'b2c3d4e5-f6a7-8b9c-0d1e-f2a3b4c5d6e7',
          name: 'Saúde',
        },
      ],
    },
    {
      id: '3b8c9d0e-1f2a-3b4c-5d6e-7f8a9b0c1d2e',
      title: 'Festival de Música anima Covilhã',
      summary: 'Evento cultural atrai milhares de visitantes à cidade.',
      content:
        'O festival anual de música da Covilhã contou com a presença de artistas nacionais e internacionais, promovendo a cultura local e dinamizando a economia regional...',
      created_at: '2025-06-08T18:45:00.000000',
      updated_at: null,
      is_approved: true,
      source_id: null,
      url: null,
      article_authors: [
        {
          author_id: 'f4a5b6c7-d8e9-0f1a-2b3c-4d5e6f7g8h9i',
          name: 'Miguel Lopes',
        },
      ],
      article_tags: [
        {
          tag_id: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
          name: 'Cultura',
        },
        {
          tag_id: 'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9g',
          name: 'Música',
        },
        {
          tag_id: 'e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9g0h',
          name: 'Covilhã',
        },
      ],
    },
    {
      id: '1cc96c4d-5e26-4c20-9d60-dfbab62ba7e6',
      title: 'Artigo bueda fixe',
      summary: 'Sumário de um artigo fixe',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
      created_at: '2025-06-10T21:42:36.966042',
      updated_at: null,
      is_approved: true,
      source_id: null,
      url: null,
      article_authors: [
        {
          author_id: 'c1bdfe53-8f5b-4f29-b938-7244ed15a1bd',
          name: 'Bruna SIlvestre',
        },
      ],
      article_tags: [
        {
          tag_id: '9b498027-e0e7-4134-9731-d39485d649af',
          name: 'UBI',
        },
        {
          tag_id: '61687db4-80e9-47fc-b60a-f667fedbc8d1',
          name: 'Região',
        },
        {
          tag_id: '88eaba41-63d3-42c6-a3da-302f635b15e8',
          name: 'Made in UBI',
        },
      ],
    },
    {
      id: '2a7e9f3b-2b6a-4e8d-9c2e-1a2b3c4d5e6f',
      title: 'Descoberta Científica Revoluciona Medicina',
      summary: 'Investigadores portugueses desenvolvem tratamento inovador para doenças raras.',
      content:
        'Uma equipa da UBI anunciou um avanço significativo no tratamento de doenças raras, recorrendo a técnicas de engenharia genética de última geração...',
      created_at: '2025-06-09T14:22:10.123456',
      updated_at: null,
      is_approved: true,
      source_id: null,
      url: null,
      article_authors: [
        {
          author_id: 'd2e3f4a5-b6c7-8d9e-0f1a-2b3c4d5e6f7g',
          name: 'João Pereira',
        },
        {
          author_id: 'e3f4a5b6-c7d8-9e0f-1a2b-3c4d5e6f7g8h',
          name: 'Ana Costa',
        },
      ],
      article_tags: [
        {
          tag_id: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6',
          name: 'Ciência',
        },
        {
          tag_id: 'b2c3d4e5-f6a7-8b9c-0d1e-f2a3b4c5d6e7',
          name: 'Saúde',
        },
      ],
    },
    {
      id: '3b8c9d0e-1f2a-3b4c-5d6e-7f8a9b0c1d2e',
      title: 'Festival de Música anima Covilhã',
      summary: 'Evento cultural atrai milhares de visitantes à cidade.',
      content:
        'O festival anual de música da Covilhã contou com a presença de artistas nacionais e internacionais, promovendo a cultura local e dinamizando a economia regional...',
      created_at: '2025-06-08T18:45:00.000000',
      updated_at: null,
      is_approved: true,
      source_id: null,
      url: null,
      article_authors: [
        {
          author_id: 'f4a5b6c7-d8e9-0f1a-2b3c-4d5e6f7g8h9i',
          name: 'Miguel Lopes',
        },
      ],
      article_tags: [
        {
          tag_id: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
          name: 'Cultura',
        },
        {
          tag_id: 'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9g',
          name: 'Música',
        },
        {
          tag_id: 'e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9g0h',
          name: 'Covilhã',
        },
      ],
    },
  ],
}
