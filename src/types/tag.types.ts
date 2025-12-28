// Tag-related type definitions

export interface TagResponse {
  tagId: number;
  title: string;
  slug: string;
  createdAt: string;
}

export interface CreateTagDto {
  title: string;
  slug?: string;
}
