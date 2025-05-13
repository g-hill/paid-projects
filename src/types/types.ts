export type ColumnType = 'todo' | 'doing' | 'done'

export interface KanbanCard {
  id: string
  content: string
  column: 'todo' | 'doing' | 'done'
  created_at: string
}
