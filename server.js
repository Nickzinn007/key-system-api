const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

let keys = [];

function generateKey() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const part = () =>
        Array.from({ length: 4 }, () =>
            chars[Math.floor(Math.random() * chars.length)]
        ).join("");

    return `STAFF-${part()}-${part()}`;
}

// gerar key
app.get("/generate", (req, res) => {
    const key = generateKey();

    keys.push({
        key,
        expiresAt: Date.now() + 3600000,
        used: false,
        usedBy: null
    });

    res.json({ key });
});

// validar key
app.get("/validate", (req, res) => {
    const { key, userId } = req.query;

    const found = keys.find(k => k.key === key);

    if (!found) return res.json({ valid: false });

    if (Date.now() > found.expiresAt) {
        return res.json({ valid: false, expired: true });
    }

    if (found.used && found.usedBy !== userId) {
        return res.json({ valid: false, used: true });
    }

    found.used = true;
    found.usedBy = userId;

    res.json({ valid: true });
});

app.listen(PORT, () => {
    console.log("API rodando na porta " + PORT);
});
