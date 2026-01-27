const Measurement = require('../models/Measurement');

exports.getMeasurements = async (req, res) => {
    try {
        const { field, start_date, end_date } = req.query;
        const query = {};
        
        if (start_date || end_date) {
            query.timestamp = {};
            if (start_date) query.timestamp.$gte = new Date(start_date);
            if (end_date) query.timestamp.$lte = new Date(end_date);
        }

        const data = await Measurement.find(query).select(`timestamp ${field}`);
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: "Invalid parameters or date format" });
    }
};

exports.getMetrics = async (req, res) => {
    try {
        const { field } = req.query;
        if (!['field1', 'field2', 'field3'].includes(field)) {
            return res.status(400).json({ error: "Invalid field name" });
        }

        const stats = await Measurement.aggregate([
            {
                $group: {
                    _id: null,
                    avg: { $avg: `$${field}` },
                    min: { $min: `$${field}` },
                    max: { $max: `$${field}` },
                    stdDev: { $stdDevPop: `$${field}` }
                }
            }
        ]);
        res.json(stats[0] || { message: "No data found" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};