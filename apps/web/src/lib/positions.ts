export type Position = {
  id: string
  title: string
  description: string
}

export const positions: Position[] = [
  {
    id: 'editor-in-chief',
    title: 'Editor-in-Chief',
    description:
      'Leads the editorial vision and direction of the magazine. Oversees all sections, manages the editorial team, and guides the selection and shaping of published work.',
  },
  {
    id: 'fiction-editor',
    title: 'Fiction Editor',
    description:
      'Reviews and selects short fiction submissions. Works with authors to develop and refine their stories for publication in each issue.',
  },
  {
    id: 'poetry-editor',
    title: 'Poetry Editor',
    description:
      'Curates and edits poetry submissions. Seeks work that pushes boundaries of form and voice while resonating with the magazine\'s seasonal themes.',
  },
  {
    id: 'creative-nonfiction-editor',
    title: 'Creative Nonfiction Editor',
    description:
      'Selects and edits essays, memoirs, and reported personal narratives. Values lyrical, thoughtful prose that draws meaning from lived experience.',
  },
  {
    id: 'multimedia-editor',
    title: 'Multimedia Editor',
    description:
      'Oversees submissions of photography, visual art, dance video, and audio work. Brings a cross-disciplinary sensibility to the magazine\'s multimedia presence.',
  },
  {
    id: 'visual-art-editor',
    title: 'Visual Art Editor',
    description:
      'Selects and presents visual art and photography submissions. Works with artists to ensure their work is represented faithfully and compellingly in print and online.',
  },
]
