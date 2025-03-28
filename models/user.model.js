import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'User Name is Required.'],
        trim:true,
        minlength:2,
        maxlength:50,
    },
    email:{
        type:String,
        required:[true , 'Email is Required.'],
        trim:true,
        unique:true,
        lowercase:true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email address'],
    },
    password:{
        type:String,
        required:[true,'User Password is Required'],
        minlength:4
    }
},
    {timestamps:true}
);

const User = mongoose.model('User',userSchema);

export default User ;