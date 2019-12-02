const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  password: { type: String, required: true },
});
UserSchema.methods.encryptPassword = function(password){
  const saltRounds = 10;
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10), null);
};

UserSchema.methods.validatePassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
