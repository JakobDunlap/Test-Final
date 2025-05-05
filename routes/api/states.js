const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');

//dunno if this works, also might need to use getAllFunFacts
router.route('/')
    .get(statesController.getAllStates)
    .post(statesController.createNewFunFact)
    .put(statesController.updateFunFact)
    .delete(statesController.deleteFunFact);

    //this is broken, needs fixing
// router.route('/:id')
//     .get(statesController.getEmployee);

module.exports = router;