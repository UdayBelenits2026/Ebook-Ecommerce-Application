export interface Category {
  id: number;
  name: string;
  description: string;
  image?: string;
  count?: number;
  icon?: string;
  featured?: boolean;
}

export interface CreateCategoryDto {
  name: string;
  description: string;
  image?: File;
}

