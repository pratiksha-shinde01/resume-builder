import { IUser } from "@/types/user.types";
import { time } from "console";
import mongoose, { Document } from "mongoose";
import bcrypt from 'bcrypt';

interface UserDocument extends Omit<IUser , '_id'>,Document{

  comparePass(candidatePassword: string): boolean;
}

let userSchema = new mongoose.Schema<UserDocument>({
  email: {
     type: String,
      required: [true, "Email is required"],
       unique: true
     },

  name: { 
    type: String,
    trim: true,
     required: [true, "Name is required"], 
     },

  password: { 
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"]
    },

 mobile:{
    type: String,
    minlength: [10, "Mobile number must be at least 10 characters long"],
    maxlength: [10, "Mobile number must be at most 10 characters long"]
 },

},{ timestamps: true });


userSchema.pre("save",  function (): void {

  if (!this.isModified("password")) return;
  this.password = bcrypt.hashSync(this.password, 10);
});

userSchema.methods.comparePass = function (candidatePassword: string): boolean {
  return bcrypt.compareSync(candidatePassword, this.password);
}


const  UserModel = mongoose.model("User", userSchema);

export default UserModel;
