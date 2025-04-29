import { ContentWithCategory } from "@shared/schema";

interface ContentCardProps {
  content: ContentWithCategory;
  url?: string;
}

export function ContentCard({ content, url = "#" }: ContentCardProps) {
  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center w-full py-3 px-4 mb-4 rounded-md bg-background border border-border text-center transition-all hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
      data-category={content.category.slug}
    >
      <h3 className="text-sm font-medium">
        {content.title}
      </h3>
    </a>
  );
}
