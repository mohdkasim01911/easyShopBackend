class queryProducts {
    constructor(products = [], query = {}) {
        this.products = products;
        this.query = query;
    }

    // ✅ Filter by category
    categoryQuery = () => {
        if (this.query.category) {
            this.products = this.products.filter(
                (c) => c.category === this.query.category
            );
        }
        return this;
    };

    // ✅ Filter by rating range (e.g., 3 ≤ rating < 4)
    ratingQuery = () => {
        if (this.query.rating) {
            const rating = parseInt(this.query.rating);
            this.products = this.products.filter(
                (c) => c.rating >= rating && c.rating < rating + 1
            );
        }
        return this;
    };

    // ✅ Filter by search value 
    searchQuery = () => {
        const search = this.query.searchValue?.trim().toUpperCase();
        if (search) {
            this.products = this.products.filter(p =>
                p.name?.toUpperCase().includes(search)
            );
        }
        return this;
    };


    // ✅ Filter by price range (FIXED: used && instead of bitwise &)
    priceQuery = () => {
        const { lowPrice, highPrice } = this.query;
        if (lowPrice !== undefined && highPrice !== undefined) {
            this.products = this.products.filter(
                (p) => p.price >= parseFloat(lowPrice) && p.price <= parseFloat(highPrice)
            );
        }
        return this;
    };

    // ✅ Sort products by price
    sortByPrice = () => {
        if (this.query.sortPrice) {
            if (this.query.sortPrice === "low-to-high") {
                this.products.sort((a, b) => a.price - b.price);
            } else if (this.query.sortPrice === "high-to-low") {
                this.products.sort((a, b) => b.price - a.price);
            }
        }
        return this;
    };

    // ✅ Pagination - skip products
    skip = () => {
        const { pageNumber = 1, parPage = 10 } = this.query;
        const skipPage = (parseInt(pageNumber) - 1) * parseInt(parPage);
        this.products = this.products.slice(skipPage);
        return this;
    };

    // ✅ Limit products per page
    limit = () => {
        const { parPage = 10 } = this.query;
        this.products = this.products.slice(0, parseInt(parPage));
        return this;
    };

    // ✅ Return final products
    getProducts = () => {
        return this.products;
    };

    // ✅ Return count of filtered products
    countProducts = () => {
        return this.products.length;
    };
}

module.exports = queryProducts;
