export default async function SliceData(page, limit,items) {
    const allItems = items; // your array of items
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const itemsOnPage = allItems.slice(startIndex, endIndex);
  
    return itemsOnPage;
  }
