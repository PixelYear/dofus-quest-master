import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Sword, Scroll, Hammer, Trophy } from "lucide-react";
import { AddObjectiveDialog } from "@/components/AddObjectiveDialog";

type Category = "Donjon" | "Quête" | "Craft" | "Succès";

interface Objective {
  id: string;
  title: string;
  description: string;
  category: Category;
  completed: boolean;
}

const categoryIcons = {
  Donjon: Sword,
  Quête: Scroll,
  Craft: Hammer,
  Succès: Trophy,
};

const categoryColors = {
  Donjon: "bg-destructive/10 text-destructive border-destructive/30",
  Quête: "bg-primary/10 text-primary border-primary/30",
  Craft: "bg-secondary/10 text-secondary-foreground border-secondary/30",
  Succès: "bg-accent/10 text-accent border-accent/30",
};

const Index = () => {
  const [objectives, setObjectives] = useState<Objective[]>([
    {
      id: "1",
      title: "Vaincre le Dragon Cochon",
      description: "Terminer le donjon du Dragon Cochon en mode difficile",
      category: "Donjon",
      completed: false,
    },
    {
      id: "2",
      title: "Quête du Dofus Émeraude",
      description: "Compléter toutes les étapes pour obtenir le Dofus Émeraude",
      category: "Quête",
      completed: false,
    },
    {
      id: "3",
      title: "Forger une Panoplie",
      description: "Crafter l'ensemble complet de la panoplie Bouftou Royal",
      category: "Craft",
      completed: true,
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);

  const toggleObjective = (id: string) => {
    setObjectives(
      objectives.map((obj) =>
        obj.id === id ? { ...obj, completed: !obj.completed } : obj
      )
    );
  };

  const addObjective = (objective: Omit<Objective, "id">) => {
    setObjectives([
      ...objectives,
      { ...objective, id: Date.now().toString() },
    ]);
    setDialogOpen(false);
  };

  const completedCount = objectives.filter((obj) => obj.completed).length;
  const totalCount = objectives.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="text-center space-y-4 py-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Grimoire d'Objectifs
          </h1>
          <p className="text-lg text-muted-foreground">
            Suivez vos aventures dans le Monde des Douze
          </p>
          <div className="flex items-center justify-center gap-2 text-sm">
            <Badge variant="secondary" className="text-base px-4 py-2">
              {completedCount} / {totalCount} Objectifs complétés
            </Badge>
          </div>
        </header>

        <div className="flex justify-end">
          <Button
            onClick={() => setDialogOpen(true)}
            className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            size="lg"
          >
            <Plus className="w-5 h-5" />
            Nouvel Objectif
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {objectives.map((objective) => {
            const Icon = categoryIcons[objective.category];
            return (
              <Card
                key={objective.id}
                className={`p-6 transition-all duration-300 hover:shadow-lg border-2 ${
                  objective.completed
                    ? "opacity-60 bg-muted/50"
                    : "hover:-translate-y-1"
                }`}
                style={{
                  boxShadow: objective.completed
                    ? undefined
                    : "var(--shadow-medieval)",
                }}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <Checkbox
                        checked={objective.completed}
                        onCheckedChange={() => toggleObjective(objective.id)}
                        className="w-6 h-6"
                      />
                      <div className="flex-1">
                        <h3
                          className={`text-lg font-semibold ${
                            objective.completed ? "line-through" : ""
                          }`}
                        >
                          {objective.title}
                        </h3>
                      </div>
                    </div>
                    <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {objective.description}
                  </p>

                  <Badge
                    variant="outline"
                    className={`${categoryColors[objective.category]} border`}
                  >
                    {objective.category}
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>

        {objectives.length === 0 && (
          <Card className="p-12 text-center">
            <Scroll className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">
              Aucun objectif pour le moment
            </h3>
            <p className="text-muted-foreground mb-4">
              Commencez à planifier vos aventures dans le Monde des Douze
            </p>
            <Button onClick={() => setDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Créer votre premier objectif
            </Button>
          </Card>
        )}
      </div>

      <AddObjectiveDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAdd={addObjective}
      />
    </div>
  );
};

export default Index;
