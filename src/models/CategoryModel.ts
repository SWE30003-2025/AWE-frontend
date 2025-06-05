export interface CategoryModel {
  id: string;
  name: string;
  description: string;
  parentCategory: string | null;
  parent_name?: string;
  children: CategoryModel[];
};
