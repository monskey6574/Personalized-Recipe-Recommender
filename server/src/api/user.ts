import express from 'express';
import {CreateUser , LoginUser} from '../applications/user'

export const userRoute = express.Router();

userRoute.route('/').post(CreateUser);

userRoute.route('/auth').post(LoginUser);