export class ComparisonUtils {
  static compareNames(a, b) {
    if (a.name < b.name)
      return -1;
    if (a.name > b.name)
      return 1;
    return 0;
  }

  static comparePrices(a, b) {
    if (parseFloat(a.price) > parseFloat(b.price))
      return -1;
    if (parseFloat(a.price) < parseFloat(b.price))
      return 1;
    return 0;
  }

  static compareMarketCap(a, b) {
    if (parseFloat(a.marketcap) > parseFloat(b.marketcap))
      return -1;
    if (parseFloat(a.marketcap) < parseFloat(b.marketcap))
      return 1;
    return 0;
  }

  static compareOrder(a, b) {
    if (Number(a.order) < Number(b.order))
      return -1;
    if (Number(a.order) > Number(b.order))
      return 1;
    return 0;
  }
}
