// Filtre les événements selon la catégorie sélectionnée
export function filterEventsByCategory(events, eventCategories, selectedCategory) {
  if (selectedCategory === 'all') return events;
  return events.filter(ev =>
    eventCategories.some(ec =>
      ec.event_id === ev.id && ec.category_id === selectedCategory
    )
  );
}
