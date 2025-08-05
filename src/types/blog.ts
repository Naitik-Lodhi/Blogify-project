export interface Blog {
  id: string;
  title: string;
  content: string;
  authorId: string;
  date: string;
  category: string;
  isFavorite?: boolean;
  image?: string; // base64-encoded image string
}
