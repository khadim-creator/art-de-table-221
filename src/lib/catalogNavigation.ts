import type { Category, Product } from '../types';

export type CatalogSortBy = 'popular' | 'price-asc' | 'price-desc';

export interface CatalogQueryState {
  category: string | null;
  q: string;
  sort: CatalogSortBy;
  minQtyOnly: boolean;
}

const DEFAULT_SORT: CatalogSortBy = 'popular';

export const normalizeCatalogToken = (value: string | null | undefined) => {
  if (!value) return '';
  return value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
};

const categoryTokens = (category: Pick<Category, 'id' | 'slug' | 'name'> & { subcategories?: string[] }) => {
  const tokens = [category.id, category.slug, category.name, ...(category.subcategories || [])];
  return tokens.map(normalizeCatalogToken).filter(Boolean);
};

export const resolveCategoryToken = (token: string | null | undefined, categories: Category[]) => {
  const normalizedToken = normalizeCatalogToken(token);
  if (!normalizedToken) return null;

  const exactMatch = categories.find((category) => categoryTokens(category).includes(normalizedToken));
  return exactMatch?.id ?? null;
};

export const productMatchesCategoryToken = (
  product: Product,
  token: string | null | undefined,
  categories: Category[],
) => {
  const normalizedToken = normalizeCatalogToken(token);
  if (!normalizedToken) return true;

  const productTokens = [product.category, product.subcategory, product.name, product.description]
    .map(normalizeCatalogToken)
    .filter(Boolean);

  if (productTokens.some((value) => value.includes(normalizedToken))) {
    return true;
  }

  const resolvedCategoryId = resolveCategoryToken(token, categories);
  if (!resolvedCategoryId) {
    return false;
  }

  const resolvedCategory = categories.find((category) => category.id === resolvedCategoryId);
  if (!resolvedCategory) {
    return false;
  }

  const resolvedTokens = categoryTokens(resolvedCategory);
  return resolvedTokens.some((value) => normalizeCatalogToken(product.category) === value);
};

export const readCatalogQueryState = (search: string): CatalogQueryState => {
  const params = new URLSearchParams(search);
  const category = params.get('category');
  const q = params.get('q') ?? '';
  const sortParam = params.get('sort');
  const minQtyParam = params.get('minQty');

  const sort = sortParam === 'price-asc' || sortParam === 'price-desc' ? sortParam : DEFAULT_SORT;
  const minQtyOnly = minQtyParam === '1' || minQtyParam === 'true';

  return {
    category: category && category.trim() ? category.trim() : null,
    q,
    sort,
    minQtyOnly,
  };
};

export const buildCatalogQueryString = (state: CatalogQueryState) => {
  const params = new URLSearchParams();

  if (state.category) params.set('category', state.category);
  if (state.q.trim()) params.set('q', state.q.trim());
  if (state.sort !== DEFAULT_SORT) params.set('sort', state.sort);
  if (state.minQtyOnly) params.set('minQty', '1');

  return params.toString();
};

export const hasCatalogQueryState = (state: CatalogQueryState) =>
  Boolean(state.category || state.q.trim() || state.sort !== DEFAULT_SORT || state.minQtyOnly);

