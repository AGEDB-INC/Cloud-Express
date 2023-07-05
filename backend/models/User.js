const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('User', userSchema);
















// // ------------------ Sequelize Schema for User - For Future Use (If Needed) ------------------ //

////// Sequelize Schema for User

// module.exports = (sequelize, DataTypes) => {
    
//     const User = sequelize.define('User', {
//         firstName: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             validate: {
//                 notEmpty: true
//             }
//         },
//         lastName: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             validate: {
//                 notEmpty: true
//             }
//         },
//         email: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             unique: true,
//             validate: {
//               isEmail: true
//             }
//           },
//           password: {
//             type: DataTypes.STRING,
//             allowNull: false
//           },
//           companyName: {
//             type: DataTypes.STRING,
//             allowNull: false,
//           }
//         },
//          {
//             timestamps: false
//         });

//     return User;
//     }
