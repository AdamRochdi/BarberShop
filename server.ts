import express from "express";
import { initDatabase, getProductsCollection, getUsersCollection } from "./database";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { sessionMiddleware } from "./sessions";


declare module "express-session" {
    interface SessionData {
        user?: {
            id: string;
            username: string;
            role: string;
        };
    }
}

dotenv.config();
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

function requireUser(req: any, res: any, next: any) {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    next();
}

function requireAdmin(req: any, res: any, next: any) {
    if (!req.session.user || req.session.user.role !== "ADMIN") {
        return res.status(403).send("Forbidden");
    }
    next();
}

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/products", requireUser, async (req, res) => {

    const productsCollection = getProductsCollection();

    const products = await productsCollection.find().toArray();

    const search =
        typeof req.query.search === "string"
            ? req.query.search
            : "";

    const sort =
        typeof req.query.sort === "string"
            ? req.query.sort
            : "";

    const order =
        typeof req.query.order === "string"
            ? req.query.order
            : "asc";

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

            if (valueA < valueB)
                return order === "desc" ? 1 : -1;

            if (valueA > valueB)
                return order === "desc" ? -1 : 1;

            return 0;
        });
    }


    res.render("products", {
        products: filteredProducts,
        sort,
        order
    });
});

app.get("/brands", requireUser, async (req, res) => {
    const productsCollection = getProductsCollection();

    const products = await productsCollection.find().toArray();

    const brands = products.map((p: any) => p.brand);

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

app.get("/products/:id", requireUser, async (req, res) => {

    const productsCollection = getProductsCollection();

    const product = await productsCollection.findOne({
        id: req.params.id
    });

    if (!product) {
        return res.status(404).send("Product not found");
    }

    res.render("product", { product });
});

app.get("/brands/:id", requireUser, async (req, res) => {
    const productsCollection = getProductsCollection();
    const products = await productsCollection.find().toArray();

    const product = products.find((p: any) => p.brand.id === req.params.id);

    if (!product) {
        return res.status(404).send("Brand not found");
    }

    res.render("brand", { brand: product.brand });
});

app.get("/products/:id/edit", requireAdmin, async (req, res) => {
    const productsCollection = getProductsCollection();

    const product = await productsCollection.findOne({
        id: req.params.id
    });

    if (!product) {
        return res.status(404).send("Product not found");
    }

    res.render("edit-product", { product });
});


app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

app.get("/register", (req, res) => {
    if (req.session.user) {
        return res.redirect("/products");
    }
    res.render("register");
});

// app.get("/debug-session", requireUser, (req, res) => {
//     res.json(req.session);
// });

app.post("/products/:id/edit", requireAdmin, async (req, res) => {
    const productsCollection = getProductsCollection();

    await productsCollection.updateOne(
        { id: req.params.id },
        {
            $set: {
                name: req.body.name,
                description: req.body.description,
                category: req.body.category,
                isActive: req.body.isActive === "true",
                imageUrl: req.body.imageUrl
            }
        }
    );

    res.redirect("/products/" + req.params.id);
});

app.post("/login", async (req, res) => {
    const usersCollection = getUsersCollection();

    const user = await usersCollection.findOne({
        username: req.body.username
    });

    if (!user) {
        return res.render("login", { error: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(
        req.body.password,
        user.password
    );

    if (!passwordMatch) {
        return res.render("login", { error: "Wrong password" });
    }

    req.session.user = {
        id: user._id,
        username: user.username,
        role: user.role
    };

    res.redirect("/products");
});

app.post("/register", async (req, res) => {
    const usersCollection = getUsersCollection();

    const existingUser = await usersCollection.findOne({
        username: req.body.username
    });

    if (existingUser) {
        return res.render("register", { error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    await usersCollection.insertOne({
        username: req.body.username,
        password: hashedPassword,
        role: "USER"
    });

    res.redirect("/login");
});


initDatabase()
    .then(async () => {
        console.log("MongoDB connected");

        const productsCollection = getProductsCollection();
        const productCount = await productsCollection.countDocuments();

        if (productCount === 0) {
            console.log("Database seeded (products)");
        } else {
            console.log("Products already exist");
        }

        const usersCollection = getUsersCollection();
        const userCount = await usersCollection.countDocuments();

        if (userCount === 0) {
            console.log("Default users created");
        } else {
            console.log("Users already exist");
        }

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`server running on port ${PORT}`);
        });
    })