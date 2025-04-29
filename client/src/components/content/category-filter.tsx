import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Category } from "@shared/schema";

interface CategoryFilterProps {
  categories: Category[];
  onFilterChange: (categorySlug: string) => void;
  className?: string;
}

export function CategoryFilter({ 
  categories, 
  onFilterChange,
  className 
}: CategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const handleCategoryClick = (categorySlug: string) => {
    setActiveCategory(categorySlug);
    onFilterChange(categorySlug);
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <Button
        size="sm"
        variant={activeCategory === "all" ? "default" : "outline"}
        className="h-8 px-4 text-xs"
        onClick={() => handleCategoryClick("all")}
      >
        All
      </Button>
      
      {categories.map((category) => (
        <Button
          key={category.id}
          size="sm"
          variant={activeCategory === category.slug ? "default" : "outline"}
          className="h-8 px-4 text-xs"
          onClick={() => handleCategoryClick(category.slug)}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
}
