export interface Metadata {
  title: string;
  ogImage: string;
  ogTitle: string;
  description: string;
  ogDescription: string;
}

export interface Link {
  id: number;
  title: string;
  url: string;
  description: string;
  tags?: string[];
  category: string;
  metadata: Metadata;
}