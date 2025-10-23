import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Copy, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface PreparatifItem {
  id: string;
  label: string;
}

const preparatifs: PreparatifItem[] = [
  { id: "arc-nomoon", label: "Arc Nomoon (2)" },
  { id: "baguette-larvesque", label: "Baguette Larvesque (2)" },
  { id: "casque", label: "Casque" },
  { id: "ailes-bois", label: "Ailes en bois" },
  { id: "misericorde", label: "Miséricorde de Chafer Elite (2)" },
  { id: "gros-boulet", label: "Gros boulet" },
  { id: "oreille-foufayteur", label: "Oreille de Foufayteur" },
  { id: "huile-sesame", label: "Huile de Sésame" },
  { id: "tronc-kokoko", label: "Tronc de Kokoko" },
  { id: "tranche-nodkoko", label: "Tranche de Nodkoko" },
  { id: "kokopaille", label: "Kokopaille" },
  { id: "coffre-maudit", label: "Coffre maudit du Flib" },
  { id: "aile-scarafeuille-bleu", label: "Aile de scarafeuille bleu" },
  { id: "aile-scarafeuille-blanc", label: "Aile de scarafeuille blanc" },
  { id: "aile-scarafeuille-rouge", label: "Aile de scarafeuille rouge" },
  { id: "aile-scarafeuille-vert", label: "Aile de scarafeuille vert" },
  { id: "laine-boufton", label: "Laine de boufton noir (5)" },
  { id: "ortie", label: "Ortie (50)" },
  { id: "pile", label: "Pile (10)" },
  { id: "rossignol", label: "Rossignol" },
  { id: "pierre-ame-50", label: "Pierre d'Âme lvl 50 (7)" },
  { id: "pierre-ame-100", label: "Pierre d'Âme lvl 100 (10)" },
  { id: "pierre-ame-150", label: "Pierre d'Âme lvl 150 (13)" },
  { id: "pierre-ame-1000", label: "Pierre d'Âme lvl 1000 (4)" },
  { id: "clef-nidas", label: "Clef Nidas (2)" },
  { id: "clef-phossile", label: "Clef Phossile" },
  { id: "clef-reine", label: "Clef Reine des Voleurs" },
  { id: "clef-toxoliath", label: "Clef Toxoliath" },
  { id: "clef-chaloeil", label: "Clef Chaloeil" },
  { id: "clef-ush", label: "Clef Ush" },
];

export const PreparatifsChecklist = () => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("preparatifs-checked");
    if (saved) {
      setCheckedItems(new Set(JSON.parse(saved)));
    }
  }, []);

  const handleCheck = (id: string, checked: boolean) => {
    const newChecked = new Set(checkedItems);
    if (checked) {
      newChecked.add(id);
    } else {
      newChecked.delete(id);
    }
    setCheckedItems(newChecked);
    localStorage.setItem("preparatifs-checked", JSON.stringify([...newChecked]));
  };

  const handleCopy = async (label: string) => {
    try {
      await navigator.clipboard.writeText(label);
      toast({
        title: "Copié !",
        description: `"${label}" copié dans le presse-papiers`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier dans le presse-papiers",
        variant: "destructive",
      });
    }
  };

  const sortedItems = useMemo(() => {
    const unchecked = preparatifs.filter((item) => !checkedItems.has(item.id));
    const checked = preparatifs.filter((item) => checkedItems.has(item.id));
    return [...unchecked, ...checked];
  }, [checkedItems]);

  const allChecked = useMemo(() => {
    return preparatifs.length === checkedItems.size;
  }, [checkedItems]);

  useEffect(() => {
    if (allChecked) {
      setIsOpen(false);
    }
  }, [allChecked]);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-2 shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <Copy className="w-5 h-5" />
              Préparatifs
              {allChecked && (
                <span className="text-sm font-normal text-muted-foreground">
                  (Complété)
                </span>
              )}
            </CardTitle>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sortedItems.map((item) => {
                const isChecked = checkedItems.has(item.id);
                return (
                  <div key={item.id} className="flex items-center space-x-2 group">
                    <Checkbox
                      id={item.id}
                      checked={isChecked}
                      onCheckedChange={(checked) => handleCheck(item.id, checked as boolean)}
                    />
                    <label
                      htmlFor={item.id}
                      className={`text-sm cursor-pointer hover:text-primary transition-colors flex-1 ${
                        isChecked ? "line-through text-muted-foreground" : ""
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleCopy(item.label);
                      }}
                    >
                      {item.label}
                    </label>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
