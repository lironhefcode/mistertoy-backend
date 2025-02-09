import express from 'express'
export const toyRoutes = express.Router()
import { addToy, getToyById, getToys, removeToy, updateToy } from './toy.controler.js'

toyRoutes.get('/',getToys)
toyRoutes.get('/:id',getToyById)
toyRoutes.put('/:id',updateToy)
toyRoutes.post('/',addToy)
toyRoutes.delete('/:id',removeToy)