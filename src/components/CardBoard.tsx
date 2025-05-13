import { useEffect, useState } from 'react'
import {
  DndContext,
  closestCenter,
  useDroppable,
  useDraggable,
  type DragEndEvent,
} from '@dnd-kit/core'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { supabase } from '../lib/supabase'
import type { KanbanCard, ColumnType } from '../types/types'

const columns: ColumnType[] = ['todo', 'doing', 'done']
const columnTitles: Record<ColumnType, string> = {
  todo: 'To Do',
  doing: 'In Progress',
  done: 'Done',
}

export function CardBoard() {
  const [cards, setCards] = useState<KanbanCard[]>([])
  const [newCardText, setNewCardText] = useState('')

  useEffect(() => {
    fetchCards()
  }, [])

  const fetchCards = async () => {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) setCards(data)
  }

  const addCard = async () => {
    if (!newCardText.trim()) return
    const { data, error } = await supabase
      .from('cards')
      .insert([{ content: newCardText.trim(), column: 'todo' }])
      .select()
      .single()

    if (!error && data) {
      setCards((prev) => [data, ...prev])
      setNewCardText('')
    }
  }

  const deleteCard = async (id: string) => {
    const { error } = await supabase.from('cards').delete().eq('id', id)
    if (!error) {
      setCards((prev) => prev.filter((card) => card.id !== id))
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    console.log('Active ID:', active.id)
    console.log('Over ID:', over?.id)

    // If no destination, return
    if (!over) return

    const cardId = active.id as string
    const destinationId = over.id as string

    // Check if we're dropping on a column
    if (!destinationId.startsWith('column-')) return

    const newColumn = destinationId.replace('column-', '') as ColumnType

    // Find the dragged card
    const draggedCard = cards.find((card) => card.id === cardId)
    if (!draggedCard || draggedCard.column === newColumn) return

    // Store the old column for potential rollback
    const oldColumn = draggedCard.column

    // Update local state first for immediate UI feedback
    setCards((prevCards) => 
      prevCards.map((card) =>
        card.id === cardId ? { ...card, column: newColumn } : card
      )
    )

    // Then update the database
    const { error } = await supabase
      .from('cards')
      .update({ column: newColumn })
      .eq('id', cardId)

    // If error, revert the state using the functional update
    if (error) {
      setCards((prevCards) => 
        prevCards.map((card) =>
          card.id === cardId ? { ...card, column: oldColumn } : card
        )
      )
      console.error('Error updating card:', error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={newCardText}
          onChange={(e) => setNewCardText(e.target.value)}
          placeholder="New task..."
          onKeyPress={(e) => {
            if (e.key === 'Enter') addCard()
          }}
        />
        <Button onClick={addCard}>Add</Button>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map((column) => (
            <KanbanColumn
              key={column}
              id={column}
              title={columnTitles[column]}
              cards={cards.filter((card) => card.column === column)}
              onDelete={deleteCard}
            />
          ))}
        </div>
      </DndContext>
    </div>
  )
}

function KanbanColumn({
  id,
  title,
  cards,
  onDelete,
}: {
  id: ColumnType
  title: string
  cards: KanbanCard[]
  onDelete: (id: string) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ 
    id: `column-${id}` 
  })

  return (
    <div
      ref={setNodeRef}
      className={`p-4 rounded border bg-card min-h-[300px] space-y-2 transition-colors ${
        isOver ? 'bg-accent/10 border-accent' : ''
      }`}
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {cards.map((card) => (
        <DraggableCard key={card.id} card={card} onDelete={onDelete} />
      ))}
    </div>
  )
}

function DraggableCard({
  card,
  onDelete,
}: {
  card: KanbanCard
  onDelete: (id: string) => void
}) {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    isDragging,
  } = useDraggable({
    id: card.id,
  })

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="p-3 bg-white shadow flex justify-between items-center"
      {...listeners}
      {...attributes}
    >
      <span className="select-none">{card.content}</span>
      <Button
        size="sm"
        variant="destructive"
        onClick={(e) => {
          e.stopPropagation()
          onDelete(card.id)
        }}
      >
        ×
      </Button>
    </Card>
  )
}