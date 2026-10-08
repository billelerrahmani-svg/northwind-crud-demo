/** Réponse des endpoints paginés générés (GET /api/xxx/page). Régénéré à chaque génération. */
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
