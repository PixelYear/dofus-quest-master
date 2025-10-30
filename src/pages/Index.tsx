import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { Scroll, Search, Trophy, Coins, Target, LogOut, Loader2, RotateCcw, Moon, Sun } from "lucide-react";
import { DonjonCard } from "@/components/DonjonCard";
import { PreparatifsChecklist } from "@/components/PreparatifsChecklist";
import { donjonsData, type Category } from "@/data/donjons";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [donjons, setDonjons] = useState(donjonsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<Category | "all">("all");
  const [loadingProgress, setLoadingProgress] = useState(true);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Load user progress from database
  useEffect(() => {
    const loadProgress = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("user_donjon_progress")
          .select("*")
          .eq("user_id", user.id);

        if (error) throw error;

        if (data && data.length > 0) {
          const progressMap = new Map(data.map((p) => [p.donjon_id, p.completed]));
          setDonjons(
            donjonsData.map((donjon) => ({
              ...donjon,
              completed: progressMap.get(donjon.id) ?? false,
            }))
          );
        }
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: "Impossible de charger votre progression",
          variant: "destructive",
        });
      } finally {
        setLoadingProgress(false);
      }
    };

    loadProgress();
  }, [user]);

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

  const resetRun = async () => {
    if (!user) return;

    try {
      // Reset all donjons locally
      setDonjons(donjonsData.map(d => ({ ...d, completed: false })));

      // Delete all progress from database
      const { error } = await supabase
        .from("user_donjon_progress")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La run a été réinitialisée",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de réinitialiser la run",
        variant: "destructive",
      });
    }
  };

  const toggleDonjon = async (id: string) => {
    if (!user) return;

    const donjon = donjons.find((d) => d.id === id);
    if (!donjon) return;

    const newCompletedState = !donjon.completed;

    // Optimistically update UI
    setDonjons(
      donjons.map((d) =>
        d.id === id ? { ...d, completed: newCompletedState } : d
      )
    );

    try {
      const { error } = await supabase.from("user_donjon_progress").upsert(
        {
          user_id: user.id,
          donjon_id: id,
          completed: newCompletedState,
          completed_at: newCompletedState ? new Date().toISOString() : null,
        },
        {
          onConflict: "user_id,donjon_id",
        }
      );

      if (error) throw error;
    } catch (error: any) {
      // Revert on error
      setDonjons(
        donjons.map((d) =>
          d.id === id ? { ...d, completed: !newCompletedState } : d
        )
      );
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la progression",
        variant: "destructive",
      });
    }
  };

  const filteredDonjons = useMemo(() => {
    const filtered = donjons.filter((donjon) => {
      const matchesSearch =
        donjon.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donjon.boss.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        filterCategory === "all" || donjon.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
    
    // Sort: incomplete first, completed last
    return filtered.sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1;
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

  if (authLoading || loadingProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        {/* Header */}
        <header className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center gap-3 mb-2 relative">
            <Button
              variant="outline"
              size="sm"
              onClick={resetRun}
              className="absolute left-0 top-0 gap-2"
              title="Réinitialiser la run"
            >
              <RotateCcw className="w-4 h-4" />
              Réinitialiser la run
            </Button>
            <Scroll className="w-12 h-12 text-primary" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Objectifs
            </h1>
            <div className="absolute right-0 top-0 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                title="Changer le thème"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                title="Se déconnecter"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
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

        {/* Préparatifs */}
        <PreparatifsChecklist />

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
