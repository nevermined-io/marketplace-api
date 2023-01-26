export interface Sort {
  [jsonPath: string]: 'asc' | 'desc'
}

export interface SearchResults {
  value: number
  relation: 'eq' | 'gte'
}
