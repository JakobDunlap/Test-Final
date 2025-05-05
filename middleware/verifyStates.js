const statesData = require('../model/statesData.json');

const stateCodes = statesData.map(state => state.code);

const verifyStateCode = (req, res, next) => {
    const state = req.params.state;
    if (!req?.params?.state) {
        return res.status(400).json({ 'message': 'State code is required.' });
    }
    if (!stateCodes.includes(req.params.state.toUpperCase())) {
        return res.status(404).json({ 'message': 'Invalid state abbreviation parameter' });
    }
    const stateCode = req.params.state.toUpperCase();
    req.code = stateCode;
    next();
}

module.export = verifyStateCode;