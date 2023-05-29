/** */
const express = require("express");
const ExpressError = require("../expressError");
const router = express.Router();
const db = require("../db");

router.get("/", async function (req, res, next) {
    try {
        const results = await db.query(
            'SELECT * FROM industries'
        )
        return res.json({ industries: results.rows })
    } catch (e) {
        return next(e);
    }
})

router.get('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const results = await db.query(`SELECT * FROM industries WHERE code = $1`, [code]);
        if (results.rows.length === 0) {
            throw new ExpressError(`can't find industry with code of ${code}`, 404);
        }
        return res.send({ industry: results.rows[0] })
    } catch (e) {
        return next(e);
    }
})

router.post('/', async (req, res, next) => {
    try {
        const { code, industry } = req.body;
        const results = await db.query(`INSERT INTO industries (code, industry) VALUES ($1, $2) RETURNING code, industry`, [code, industry]);
        return res.status(201).json({ industry: { code, industry } });
    } catch (e) {
        return next(e)
    }
})

router.patch(`/:code`, async (req, res, next) => {
    try {
        const { code } = req.params;
        const { industry } = req.body;
        const results = await db.query(`UPDATE industries SET industry=$1 WHERE code=$2 Returning code, name, description`, [industry, code])
        if (results.rows.length === 0) {
            throw new ExpressError(`can't update industry with code of ${code}`, 404)
        }
        return res.send({ company: results.rows[0] })
    } catch (e) {
        return next(e);
    }
})

router.delete(`/:code`, async (req, res, next) => {
    try {
        const results = db.query(`DELETE FROM industries WHERE code = $1`, [req.params.code])
        return res.send({ msg: "DELETED!" })
    } catch (e) {
        return next(e);
    }
})

module.exports = router;