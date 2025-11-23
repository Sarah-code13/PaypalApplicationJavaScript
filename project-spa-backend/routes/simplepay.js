var express = require('express');
var router = express.Router();

let balances = {
    A: 1000,
    B: 1000,
    C: 1000
};

router.get('/balances', function(req, res, next) {
    res.json(balances);
});
router.post('/pay', function(req, res, next) {
    const from = req.body.from;
    const to = req.body.to;
    const amount = Number(req.body.amount);

    if (!from || !to || from === to) {
        return res.status(400).json({ error: 'You have to choose different accounts to send money from and to.' });
    }
    if (amount <= 0) {
        return res.status(400).json({ error: 'Amount must be greater than 0' });
    }
    if (balances[from] === undefined || balances[to] === undefined) {
        return res.status(400).json({ error: 'Invalid account specified.' });
    }
    if (balances[from] < amount) {
        return res.status(400).json({ error: 'Insufficient balance in the sender account.' });
    }
    balances[from] -= amount;
    balances[to] += amount;
    res.json({
        message: `Successfully sent $${amount} from ${from} to ${to}.`,
        balances
    }); 
});
module.exports = router;