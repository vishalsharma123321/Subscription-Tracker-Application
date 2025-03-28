import { Router } from "express";
import { getUSers , getUser } from "../controllers/user.controller.js";
import {authorization} from '../middlewares/auth.middleware.js'

const userRouter = Router();

userRouter.get('/', getUSers );

userRouter.get('/:id',authorization,  getUser);

// userRouter.post('/:id',(req,res)=>res.send({title : "Create User Data "}));

// userRouter.put('/:id',(req,res)=>res.send({title : "Update User Data "}));

// userRouter.delete('/:id',(req,res)=>res.send({title : "Delete User"}));

export default userRouter;