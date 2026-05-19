import express from "express";
import products from "./data/products.json"

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index")
});

app.get("/products/:id", (req, res) => {
    const product = products.find((productId) => productId.id === req.params.id);

    if (!product) {
        return res.status(404).send("Product not found");
    }

    res.render("product", { product });
});

app.get("/products", (req, res) => {
    const search = typeof req.query.search === "string" ? req.query.search : "";
    const sort = typeof req.query.sort === "string" ? req.query.sort : "";
    const order = typeof req.query.order === "string" ? req.query.order : "asc";

    let filteredProducts = products;

    // filteren op naam
    if (typeof search === "string") {
        filteredProducts = filteredProducts.filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase())
        );
    }

    // sorteren
    if (sort) {
        filteredProducts.sort((a, b) => {
            const valueA = String((a as any)[sort]).toLowerCase();
            const valueB = String((b as any)[sort]).toLowerCase();

            if (valueA < valueB) return order === "desc" ? 1 : -1;
            if (valueA > valueB) return order === "desc" ? -1 : 1;
            return 0;
        });
    }
    res.render("products", {
        products: filteredProducts,
        sort: sort || "",
        order: order || "asc"
    });
});

app.get("/brands/:id", (req, res) => {
    const product = products.find(productid => productid.brand.id === req.params.id)

    if (!product) {
        return res.status(404).send("Brand not found");
    }

    const brand = product.brand;

    res.render("brand", { brand })
})

app.listen(3000, () => {
    console.log("server running");
});
