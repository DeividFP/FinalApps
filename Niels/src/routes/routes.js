//Archivo de rutas principal
const router = require('express-promise-router')();

const {
    index,
    newUser,
    getUser,
    replaceUser,
    deleteUser,
    getUserCars,
    newUserCar
} = require('../controllers/usercontroller');

router.get('/', index);
router.get('/:userId', getUser);
router.put('/:userId', replaceUser);
router.post('/', newUser);
router.delete('/:userId', deleteUser);
router.get('/:userId/cars', getUserCars);
router.post('/:userId/cars', newUserCar);


module.exports = router;