import express from "express";

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

const DATA_URL_PRODUCTS = "https://raw.githubusercontent.com/AdamRochdi/BarberShop/refs/heads/main/public/data/products.json";
const DATA_URL_BRANDS = "https://raw.githubusercontent.com/AdamRochdi/BarberShop/refs/heads/main/public/data/brands.json";

async function getProducts() {
    const res = await fetch(DATA_URL_PRODUCTS);
    return await res.json();
}

async function getBrands() {
    const res = await fetch(DATA_URL_BRANDS);
    return await res.json();
}

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/products", async (req, res) => {
    const products = await getProducts();

    const search = typeof req.query.search === "string" ? req.query.search : "";
    const sort = typeof req.query.sort === "string" ? req.query.sort : "";
    const order = typeof req.query.order === "string" ? req.query.order : "asc";

    let filteredProducts = products;

    if (search) {
        filteredProducts = filteredProducts.filter((p: any) =>
            p.name.toLowerCase().includes(search.toLowerCase())
        );
    }

    if (sort) {
        filteredProducts.sort((a: any, b: any) => {
            const valueA = String(a[sort]).toLowerCase();
            const valueB = String(b[sort]).toLowerCase();

            if (valueA < valueB) return order === "desc" ? 1 : -1;
            if (valueA > valueB) return order === "desc" ? -1 : 1;
            return 0;
        });
    }

    res.render("products", {
        products: filteredProducts,
        sort,
        order
    });
});

app.get("/brands", async (req, res) => {
    const brands = await getBrands();

    const search = typeof req.query.search === "string" ? req.query.search : "";
    const sort = typeof req.query.sort === "string" ? req.query.sort : "";
    const order = typeof req.query.order === "string" ? req.query.order : "asc";

    let filteredBrands = brands;

    if (search) {
        filteredBrands = filteredBrands.filter((p: any) =>
            p.name.toLowerCase().includes(search.toLowerCase())
        );
    }

    if (sort) {
        filteredBrands.sort((a: any, b: any) => {
            const valueA = String(a[sort]).toLowerCase();
            const valueB = String(b[sort]).toLowerCase();

            if (valueA < valueB) return order === "desc" ? 1 : -1;
            if (valueA > valueB) return order === "desc" ? -1 : 1;
            return 0;
        });
    }

    res.render("brands", {
        brands: filteredBrands,
        sort,
        order
    });
})

app.get("/products/:id", async (req, res) => {
    const products = await getProducts();

    const product = products.find((p: any) => p.id === req.params.id);

    if (!product) {
        return res.status(404).send("Product not found");
    }

    res.render("product", { product });
});

app.get("/brands/:id", async (req, res) => {
    const products = await getProducts();

    const product = products.find((p: any) => p.brand.id === req.params.id);

    if (!product) {
        return res.status(404).send("Brand not found");
    }

    res.render("brand", { brand: product.brand });
});

app.listen(3000, () => {
    console.log("server running");
});