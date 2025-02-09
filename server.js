import path from 'path'
import cors from 'cors'
import express from 'express'
import cookieParser from 'cookie-parser'

import { toyService } from './api/toys/toy.service.js'
import { toyRoutes } from './api/toys/toy.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { authRoutes } from './api/auth/auth.routes.js'

const app = express()

// Express Config:
const corsOptions = {
    origin: [
        'http://127.0.0.1:8080',
        'http://localhost:8080',
        'http://127.0.0.1:5173',
        'http://localhost:5173',
        'http://localhost:27017'
    ],
    credentials: true
}

app.use(cors(corsOptions))
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())



app.use('/api/toy',toyRoutes)
app.use('/api/user',userRoutes)
app.use('/api/auth',authRoutes)













const PORT = process.env.PORT || 3030
app.listen(PORT)

