export type IssueEntry = {
  id: string
  status: 'Current issue' | 'Coming soon'
  season: string
  title: string
  summary: string
  window: string
  note: string
  pdfUrl?: string
}

export const issues: IssueEntry[] = [
  {
    id: 'signal-noise',
    status: 'Current issue',
    season: 'Summer 2026',
    title: 'Signal / Noise',
    summary:
      'Essays, dispatches, and criticism about what survives the algorithm: local scenes, durable ideas, and the people who keep culture legible.',
    window: 'Open for pitches through June 20',
    note: 'Brief and reading package publishing soon.',
    pdfUrl: '/sample-magazine.pdf', // Sample PDF for testing
  },
  {
    id: 'after-the-interface',
    status: 'Coming soon',
    season: 'Autumn 2026',
    title: 'After the Interface',
    summary:
      'A forthcoming issue on software after novelty: maintenance, human labor, invisible systems, and the texture of digital life once the launch cycle ends.',
    window: 'Reading window announced in July',
    note: 'Theme preview only for now.',
  },
]

export const currentIssue = issues.find((issue) => issue.status === 'Current issue') ?? issues[0]
export const upcomingIssues = issues.filter((issue) => issue.status === 'Coming soon')
