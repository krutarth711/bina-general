const db = require('../helpers/database');
const User = db.users;

const createUser = async (req, res) => {
    try {
        const role = req.params.role;
        const { username, password, email } = req.body;
        password = bcrypt.hashSync(req.body.password, 8)
        await User.create({role, username, password, email});
        res.status(200).json({message: 'User created successfully'});
    } catch (error) {
        res.status(500).json({message:'Error creating user'});
    }
};

const getUser = async (req, res) => {
    console.log('IN HERE');
    try {
        const user = await User.findAll({username: req.params.username});
        if(!user){
            res.status(400).json({message: 'User not found'});
        }
        res.status(200).json({message: 'User found!', user});
    } catch (error) {
        console.log('ERROR: ', error);
        res.status(500).json({message: 'Error occured while fetching the user'});
    }
};

// const updateUser = async (req, res) => {
//     try {
//         const user = await User.find({username: req.query.username});
//         if(!user){
//             res.status(400).json({message: 'User not found'});
//         }
//         res.status(200).json({message: 'User found!', user});
//     } catch (error) {
//         res.status(500).json({message: 'Error occured while fetching the user'});
//     }
// };

module.exports = {
    createUser,
    getUser
}