export interface Metadata {
  title: string;
  ogImage: string;
  ogTitle: string;
  description: string;
  ogDescription: string;
}

export interface Link {
  id: string;
  title: string;
  url: string;
  description: string;
  tags?: string[];
  category: string;
  metadata: Metadata;
  createdAt: string;
  updatedAt: string;
  contentText: string;  
  isProcessing?: boolean;
}