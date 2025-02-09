import express from 'express'
export const toyRoutes = express.Router()
import { addToy, addToyMsg, getToyById, getToys, removeToy, updateToy } from './toy.controler.js'
import { requireAdmin, requireAuth } from '../../middlewares/requireAuth.middleware.js'

toyRoutes.get('/',getToys)
toyRoutes.get('/:id',getToyById)
toyRoutes.put('/:id',requireAdmin,updateToy)
toyRoutes.post('/',requireAdmin,addToy)
toyRoutes.delete('/:id',requireAdmin,removeToy)


toyRoutes.post('/:id/msg',requireAuth, addToyMsg)