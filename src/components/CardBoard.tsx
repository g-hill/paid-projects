import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  useDroppable,
  useDraggable,
  type DragEndEvent,
} from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardAction } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "../lib/supabase";
import type { KanbanCard, ColumnType } from "../types/types";

const columns: ColumnType[] = ["todo", "doing", "done"];
const columnTitles: Record<ColumnType, string> = {
  todo: "To Do",
  doing: "In Progress",
  done: "Done",
};

export function CardBoard() {
  const [cards, setCards] = useState<KanbanCard[]>([]);
  const [newCardText, setNewCardText] = useState("");

  useEffect(() => {
    fetchCards();

    const getCurrentUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching current user:", error);
      } else {
        console.log("Current logged-in user ID:", user?.id);
      }
    };

    getCurrentUser();
  }, []);

  const fetchCards = async () => {
    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      console.log("Cards fetched from Supabase:", data);
      setCards(data);
    } else {
      console.error("Error fetching cards:", error);
    }
  };

  const addCard = async () => {
    if (!newCardText.trim()) return;

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Unable to get current user:", userError);
      return;
    }

    const { data, error } = await supabase
      .from("cards")
      .insert([
        {
          content: newCardText.trim(),
          column: "todo",
          user_id: user.id, // <-- Add user_id for RLS
        },
      ])
      .select()
      .single();

    if (!error && data) {
      setCards((prev) => [data, ...prev]);
      setNewCardText("");
    } else {
      console.error("Error inserting card:", error);
    }
  };

  const deleteCard = async (id: string) => {
    console.log("Attempting to delete card ID:", id);
    const { data, error } = await supabase.from("cards").delete().eq("id", id);

    console.log("Delete result:", { data, error });

    if (!error) {
      setCards((prev) => prev.filter((card) => card.id !== id));
    } else {
      console.error("Delete failed:", error);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const cardId = active.id as string;
    const destinationId = over.id as string;

    if (!destinationId.startsWith("column-")) return;

    const newColumn = destinationId.replace("column-", "") as ColumnType;
    const draggedCard = cards.find((card) => card.id === cardId);
    if (!draggedCard || draggedCard.column === newColumn) return;

    const oldColumn = draggedCard.column;

    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId ? { ...card, column: newColumn } : card
      )
    );

    const { error } = await supabase
      .from("cards")
      .update({ column: newColumn })
      .eq("id", cardId);

    if (error) {
      console.error("Error updating card:", error);
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId ? { ...card, column: oldColumn } : card
        )
      );
    }
  };
  console.log("Current cards in state:", cards);
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={newCardText}
          onChange={(e) => setNewCardText(e.target.value)}
          placeholder="New task..."
          onKeyPress={(e) => {
            if (e.key === "Enter") addCard();
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
  );
}

function KanbanColumn({
  id,
  title,
  cards,
  onDelete,
}: {
  id: ColumnType;
  title: string;
  cards: KanbanCard[];
  onDelete: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${id}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={`p-4 rounded border bg-card min-h-[300px] space-y-2 transition-colors ${
        isOver ? "bg-accent/10 border-accent" : ""
      }`}
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {cards.map((card) => (
        <DraggableCard key={card.id} card={card} onDelete={onDelete} />
      ))}
    </div>
  );
}

function DraggableCard({
  card,
  onDelete,
}: {
  card: KanbanCard;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: card.id,
    });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
<Card ref={setNodeRef} style={style} {...attributes}>
  <CardContent className="px-6 py-2">
    {/* Drag handle bar */}
    <div
      className="h-4 w-full mb-2 rounded bg-muted cursor-grab"
      {...listeners}
    >-- drag this --</div>

    {/* Card content + delete button */}
    <div className="flex justify-between items-center">
      <span className="select-none"{...listeners}>{card.content}</span>
      <CardAction>
        <Button
          size="sm"
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            console.log("Delete clicked for card:", card.id);
            onDelete(card.id);
          }}
        >
          ×
        </Button>
      </CardAction>
    </div>
  </CardContent>
</Card>
  );
}
