import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Category = "Donjon" | "Quête" | "Craft" | "Succès";

interface AddObjectiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (objective: {
    title: string;
    description: string;
    category: Category;
    completed: boolean;
  }) => void;
}

export function AddObjectiveDialog({
  open,
  onOpenChange,
  onAdd,
}: AddObjectiveDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("Quête");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd({
        title: title.trim(),
        description: description.trim(),
        category,
        completed: false,
      });
      setTitle("");
      setDescription("");
      setCategory("Quête");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Nouvel Objectif</DialogTitle>
          <DialogDescription>
            Ajoutez un nouvel objectif à votre grimoire d'aventures
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre de l'objectif</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Terminer le Donjon des Bworks"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez votre objectif en détail..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as Category)}
            >
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Quête">Quête</SelectItem>
                <SelectItem value="Donjon">Donjon</SelectItem>
                <SelectItem value="Craft">Craft</SelectItem>
                <SelectItem value="Succès">Succès</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-primary to-accent"
            >
              Ajouter l'objectif
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
