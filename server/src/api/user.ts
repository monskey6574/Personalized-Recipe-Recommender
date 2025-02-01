import express from 'express';
import {CreateUser} from '../applications/user'

export const userRoute = express.Router();

userRoute.route('/').post(CreateUser);