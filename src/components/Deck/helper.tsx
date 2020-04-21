export function getAllProductsOf(n: number) {
  let products: number[][] = [];
  let a = Math.floor(Math.sqrt(n));
  let b = Math.ceil(Math.sqrt(n));
  for (; a >= 1; a--) {
    for (; a * b < n; b++);
    products.push([a, b]);
    products.push([b, a]);
  }
  return products;
}

export function bestLayoutFor(n: number, ratio: number) {
  const products = getAllProductsOf(n).filter(([a, b]) => a >= 3 && b >= 3);
  const scoreOfProducts = products.map(([a, b]) =>
    Math.abs(a / b - ratio || 0)
  );
  const bestProductIndex = scoreOfProducts.indexOf(
    Math.min(...scoreOfProducts)
  );

  return products[bestProductIndex] || [0, 0];
}
