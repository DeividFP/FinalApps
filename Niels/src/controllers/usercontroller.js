//Importando modelos a usar
const User = require('../models/user');
const Car = require('../models/cars');

module.exports = {

    /***
     * return users
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    index: async (req, res, next) => {
        const users =  await User.find({});
        res.status(200).json(users);
    },

    /**
     * add new user
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    newUser: async (req, res, next) => {
        const newUser = new User(req.body);
        const user = await newUser.save();
        res.status(200).json(user);
    },

    /**
     * return one user
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    getUser: async (req, res, next) => {
        const {userId} = req.params;
        const user = await User.findById(userId);
        res.status(200).json(user);
    },

    /**
     * update one camp for one user
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    replaceUser: async (req, res, next) => {
        const {userId} = req.params;
        const newUser = req.body;
        const oldUser = await User.findByIdAndUpdate(userId, newUser);
        res.status(200).json({success: true});
    },

    /**
     * update all camps for one user
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    updateUser: async (req, res, next) => {
        const {userId} = req.params;
        const newUser = req.body;
        const oldUser = await User.findByIdAndUpdate(userId, newUser);
        res.status(200).json({success: true});
    },

    /**
     * delete user
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    deleteUser: async (req, res, next) => {
        const {userId} = req.params;
        const oldUser = await User.findByIdAndRemove(userId);
        res.status(200).json({success: true});
    },

    /**
     * get cars for user
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    getUserCars: async (req, res, next) => {
        const {userId} = req.params;
        const user = await User.findById(userId).populate('cars');
        res.status(200).json(user);
    },

    /**
     * add new car for one user
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    newUserCar: async (req, res, next) => {
        const {userId} = req.params;
        const newCar = new Car(req.body);
        const user = await User.findById(userId);
        newCar.seller = user;
        await newCar.save();
        user.cars.push(newCar);
        await user.save();
        res.status(200).json(newCar);
    }

}