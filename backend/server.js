import mysql from "mysql2/promise";
import express from 'express';
import cors from 'cors';
import db from "./config/db.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.post('/product', async (req, res) => {
    try {
        let { title, description, price, category, thumbnail } = req.body;
        let [query] = await db.query(
            'INSERT INTO products (title, description, price, category, thumbnail) VALUES (?, ?, ?, ?, ?)',
            [title, description, price, category, thumbnail]
        );
        res.json({ id: query.insertId, title });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/products', async (req, res) => {
    try {
        let [rows] = await db.query('SELECT * FROM products');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Տվյալների բազայի սխալ" });
    }
});

app.get('/products', async (req, res) => {
    let [rows] = await db.query('SELECT * FROM products');
    res.json(rows);
});

app.get('/products/:id', async (req, res) => {
    let id = req.params.id;
    let [row] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    res.json(row[0]);
});

app.get('/products/category/:category', async (req, res) => {
    let category = req.params.category;
    let [rows] = await db.query('SELECT * FROM products WHERE category = ?', [category]);
    res.json(rows);
});

app.post('/product', async (req, res) => {
    let { title, description, price, category, thumbnail } = req.body;

    if (!title || !price) {
        return res.json({ error: "Title and Price are required" });
    }

    let [query] = await db.query(
        'INSERT INTO products (title, description, price, category, thumbnail) VALUES (?, ?, ?, ?, ?)',
        [title, description, price, category, thumbnail]
    );

    res.json({
        id: query.insertId,
        title,
        price,
        category
    });
});

app.delete('/products/:id', async (req, res) => {
    let id = req.params.id;
    await db.query('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: "Product deleted" });
});

app.get('/products/search/:q', async (req, res) => {
    let q = req.params.q;
    let [rows] = await db.query('SELECT * FROM products WHERE title LIKE ?', [`%${q}%`]);
    res.json(rows);
});

const port = 3008;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});