import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Sword,
  Users,
  Trophy,
  Coins,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Donjon } from "@/data/donjons";
import { useState } from "react";

interface DonjonCardProps {
  donjon: Donjon;
  onToggle: (id: string) => void;
}

const successTypeColors = {
  challenge: "bg-primary/10 text-primary border-primary/30",
  monstre: "bg-destructive/10 text-destructive border-destructive/30",
  capture: "bg-accent/10 text-accent border-accent/30",
  other: "bg-secondary/10 text-secondary-foreground border-secondary/30",
};

export function DonjonCard({ donjon, onToggle }: DonjonCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      className={`p-5 transition-all duration-300 border-2 ${
        donjon.completed
          ? "opacity-60 bg-muted/50"
          : "hover:-translate-y-1 hover:shadow-lg"
      }`}
      style={{
        boxShadow: donjon.completed ? undefined : "var(--shadow-medieval)",
      }}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox
              checked={donjon.completed}
              onCheckedChange={() => onToggle(donjon.id)}
              className="mt-1 w-5 h-5"
            />
            <div className="flex-1 space-y-1">
              <h3
                className={`text-lg font-bold leading-tight ${
                  donjon.completed ? "line-through" : ""
                }`}
              >
                {donjon.nom}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sword className="w-4 h-4" />
                <span className="font-medium">{donjon.boss}</span>
                <span className="text-xs">• Niv. {donjon.niveau}</span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="text-xs shrink-0">
            {donjon.category}
          </Badge>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 text-primary">
            <Coins className="w-4 h-4" />
            <span className="font-semibold">
              {donjon.kamasTotal.toLocaleString()}K
            </span>
          </div>
          <div className="flex items-center gap-2 text-accent">
            <Trophy className="w-4 h-4" />
            <span className="font-semibold">{donjon.pointsSucces} pts</span>
          </div>
        </div>

        {/* Bouton pour développer/réduire */}
        {(donjon.succes.length > 0 || donjon.lienVideo || donjon.notes) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="w-full justify-between"
          >
            <span className="text-sm">
              {expanded ? "Masquer les détails" : "Voir les détails"}
            </span>
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        )}

        {/* Détails étendus */}
        {expanded && (
          <div className="space-y-3 pt-2 border-t">
            {/* Succès */}
            {donjon.succes.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Users className="w-4 h-4" />
                  <span>Succès requis</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {donjon.succes.map((succes, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className={`text-xs ${
                        successTypeColors[succes.type]
                      } border`}
                    >
                      {succes.nom}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {donjon.notes && (
              <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
                <span className="font-semibold">Note : </span>
                {donjon.notes}
              </div>
            )}

            {/* Lien vidéo */}
            {donjon.lienVideo && (
              <a
                href={donjon.lienVideo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                Voir le combat en vidéo
              </a>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
