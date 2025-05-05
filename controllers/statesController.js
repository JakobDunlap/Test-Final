const fs = require('fs');
const path = require('path');
const State = require('../model/State');
const stateCodes = require('../middleware/verifyStates');
//Bring in statesData.json as const data
const data = {
    states: require('../model/statesData.json'),
    setStateData: function (data) { this.states = data }
}

//Send statesData.json data as response

const getAllStates = async (req, res) => { 
  try {
    // Load JSON state data
    const filePath = path.join(__dirname, '../model/statesData.json');
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    // Get all MongoDB fun fact entries
    const dbStates = await State.find(); // returns documents with code + funfacts
    // Convert MongoDB array to lookup object: { KS: ["...", "..."], CA: [...] }
    const funFactMap = {};
    dbStates.forEach(state => {
        if (state.stateCode && state.funfacts) {
            funFactMap[state.stateCode] = state.funfacts;
        }
    });
    // Merge: attach funfacts to matching state in JSON
    const mergedStates = jsonData.map(state => {
        const facts = funFactMap[state.code];
        return {
          ...state,
          ...(facts && { funfacts: facts }) // only include if exists
        };
    });
    res.json(mergedStates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

//Create from .json,, maybe not needed?
// const createNewEmployee = (req, res) => {
//     const newEmployee = {
//         id: data.employees?.length ? data.employees[data.employees.length - 1].id + 1 : 1,
//         firstname: req.body.firstname,
//         lastname: req.body.lastname
//     }

//     if (!newEmployee.firstname || !newEmployee.lastname) {
//         return res.status(400).json({ 'message': 'First and last names are required.' });
//     }

//     data.setEmployees([...data.employees, newEmployee]);
//     res.status(201).json(data.employees);
// }

//Update from .json,, maybe not needed?
// const updateEmployee = (req, res) => {
//     const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
//     if (!employee) {
//         return res.status(400).json({ "message": `Employee ID ${req.body.id} not found` });
//     }
//     if (req.body.firstname) employee.firstname = req.body.firstname;
//     if (req.body.lastname) employee.lastname = req.body.lastname;
//     const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
//     const unsortedArray = [...filteredArray, employee];
//     data.setEmployees(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
//     res.json(data.employees);
// }

//Delete from .json,, maybe not needed??
// const deleteEmployee = (req, res) => {
//     const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
//     if (!employee) {
//         return res.status(400).json({ "message": `Employee ID ${req.body.id} not found` });
//     }
//     const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
//     data.setEmployees([...filteredArray]);
//     res.json(data.employees);
// }

//Get one from .json,, idk
// const getEmployee = (req, res) => {
//     const employee = data.employees.find(emp => emp.id === parseInt(req.params.id));
//     if (!employee) {
//         return res.status(400).json({ "message": `Employee ID ${req.params.id} not found` });
//     }
//     res.json(employee);
// }

const getAllFunFacts = async (req, res) => {
    const employees = await Employee.find();
    if (!employees) return res.status(204).json({ 'message' : 'No employees found.'});
    res.json(employees);
}

const createNewFunFact = async (req, res) => {
    if (!req?.body?.firstname || !req?.body?.lastname) {
        return res.status(400).json({ 'message': 'First and last names are required.' })
    }

    try {
        const result = await Employee.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname
        });

        res.status(201).json(result); //201 created
    } catch (err) {
        console.error(err);
    }
}

const updateFunFact = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ${req.body.id}.` });
    }
    if (req.body?.firstname) employee.firstname = req.body.firstname;
    if (req.body?.lastname) employee.lastname = req.body.lastname;
    const result = await employee.save();
    res.json(result);
}

const deleteFunFact = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Employee ID required.' });

    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ${req.body.id}.` });
    }
    const result = await employee.deleteOne({ _id: req.body.id });
    res.json(result);
}

const getFunFact = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Employee ID required.' });

    const employee = await Employee.findOne({ _id: req.params.id }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ${req.params.id}.` });
    }
    res.json(employee);
}

module.exports = {
    getAllFunFacts,
    createNewFunFact,
    updateFunFact,
    deleteFunFact,
    getFunFact,
    getAllStates
}