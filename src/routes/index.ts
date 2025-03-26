import express from 'express';
import { lineRoute } from './line/lineRoute';

export const routes = express.Router();

routes.use('/line', lineRoute);
