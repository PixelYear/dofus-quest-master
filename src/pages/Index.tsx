import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Scroll, Search, Trophy, Coins, Target } from "lucide-react";
import { DonjonCard } from "@/components/DonjonCard";
import { donjonsData, type Category } from "@/data/donjons";

const Index = () => {
  const [donjons, setDonjons] = useState(donjonsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<Category | "all">("all");

  const categories: (Category | "all")[] = [
    "all",
    "TDD Partie 1",
    "TDD Partie 2",
    "TDD Partie 3",
    "TDD Partie 4",
    "TDD Partie 5",
    "TDM Partie 1",
    "TDM Partie 2",
    "TDM Partie 3",
    "TDM Partie 4",
    "TDM Partie 5",
    "TDM Partie 6",
    "TDM Partie 7",
  ];

  const toggleDonjon = (id: string) => {
    setDonjons(
      donjons.map((donjon) =>
        donjon.id === id ? { ...donjon, completed: !donjon.completed } : donjon
      )
    );
  };

  const filteredDonjons = useMemo(() => {
    return donjons.filter((donjon) => {
      const matchesSearch =
        donjon.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donjon.boss.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        filterCategory === "all" || donjon.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [donjons, searchTerm, filterCategory]);

  const stats = useMemo(() => {
    const completed = donjons.filter((d) => d.completed);
    const totalKamas = completed.reduce((sum, d) => sum + d.kamasTotal, 0);
    const totalPoints = completed.reduce((sum, d) => sum + d.pointsSucces, 0);
    return {
      completedCount: completed.length,
      totalCount: donjons.length,
      totalKamas,
      totalPoints,
    };
  }, [donjons]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        {/* Header */}
        <header className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Scroll className="w-12 h-12 text-primary" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Run de Vaga
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Guide complet TDD & TDM - Suivi de progression
          </p>

          {/* Stats globales */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Badge variant="secondary" className="text-base px-4 py-2 gap-2">
              <Target className="w-4 h-4" />
              {stats.completedCount} / {stats.totalCount} Donjons
            </Badge>
            <Badge variant="outline" className="text-base px-4 py-2 gap-2 border-primary/30 text-primary">
              <Coins className="w-4 h-4" />
              {stats.totalKamas.toLocaleString()}K
            </Badge>
            <Badge variant="outline" className="text-base px-4 py-2 gap-2 border-accent/30 text-accent">
              <Trophy className="w-4 h-4" />
              {stats.totalPoints} pts
            </Badge>
          </div>
        </header>

        {/* Filtres et recherche */}
        <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-lg border-2 shadow-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher un donjon ou boss..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={filterCategory}
            onValueChange={(value) => setFilterCategory(value as Category | "all")}
          >
            <SelectTrigger className="w-full sm:w-[220px]">
              <SelectValue placeholder="Filtrer par étape" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat === "all" ? "Toutes les étapes" : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Liste des donjons */}
        {filteredDonjons.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDonjons.map((donjon) => (
              <DonjonCard
                key={donjon.id}
                donjon={donjon}
                onToggle={toggleDonjon}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Scroll className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">
              Aucun donjon trouvé
            </h3>
            <p className="text-muted-foreground">
              Essayez de modifier vos filtres de recherche
            </p>
          </div>
        )}

        {/* Footer info */}
        <div className="text-center text-sm text-muted-foreground pt-8 border-t">
          <p>
            Guide créé par <span className="font-semibold text-primary">Vaga</span> •{" "}
            Modifié par <span className="font-semibold text-accent">DamsShiro</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
