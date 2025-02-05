import path from 'path'
import cors from 'cors'
import express from 'express'
import cookieParser from 'cookie-parser'

import { toyService } from './services/toy.service.js'

const app = express()

// Express Config:
const corsOptions = {
    origin: [
        'http://127.0.0.1:8080',
        'http://localhost:8080',
        'http://127.0.0.1:5173',
        'http://localhost:5173'
    ],
    credentials: true
}

app.use(cors(corsOptions))
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// Express Routing:

// REST API for toys
app.get('/api/toy/all',(req,res)=>{
    toyService.getAllToys()
                .then(toys=> res.send(toys))
                .catch(err => res.status(400).send('Cannot get toys') )
})


app.get('/api/toy', (req, res) => {
    console.log(req.query)
    const filterBy = {
         txt: req.query.txt||'', 
         inStock: ((req.query.inStock==='true')? true:(req.query.inStock==='false')? false:'all'),
          sortBy: req.query.sortBy||'name',
          labels:  req.query.labels||[],
          pageIdx: +req.query.pageIdx||0
    }
    toyService.query(filterBy)
        .then(toys => res.send(toys))
        .catch(err => {
            // loggerService.error('Cannot get toys', err)
            res.status(400).send('Cannot get toys')
        })
})

app.get('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params

    toyService.getById(toyId)
        .then(toy => res.send(toy))
        .catch(err => {
            loggerService.error('Cannot get toy', err)
            res.status(400).send('Cannot get toy')
        })
})

app.post('/api/toy', (req, res) => {
    
    const toy = {
        name: req.body.name,
        price: +req.body.price,
        inStock: req.body.inStock,
        labels: req.body.labels
    }
    toyService.save(toy)
        .then(savedToy => res.send(savedToy))
        .catch(err => {

            res.status(400).send('Cannot save toy')
        })
})

app.put('/api/toy/:id', (req, res) => {
   

    const toy = {
        _id: req.params.id,
        name: req.body.name,
        price: +req.body.price,
        inStock: req.body.inStock,
        labels: req.body.labels
    }
    toyService.save(toy)
        .then(savedToy => res.send(savedToy))
        .catch(err => {
            loggerService.error('Cannot save toy', err)
            res.status(400).send('Cannot save toy')
        })
})

app.delete('/api/toy/:toyId', (req, res) => {
 
    const { toyId } = req.params
    toyService.remove(toyId)
        .then(() => res.send('Removed!'))
        .catch(err => {
            loggerService.error('Cannot remove toy', err)
            res.status(400).send('Cannot remove toy')
        })
})

// // User API
// app.get('/api/user', (req, res) => {
//     userService.query()
//         .then(users => res.send(users))
//         .catch(err => {
//             loggerService.error('Cannot load users', err)
//             res.status(400).send('Cannot load users')
//         })
// })



// app.get('/api/user/:userId', (req, res) => {
//     const { userId } = req.params

//     userService.getById(userId)
//         .then(user => res.send(user))
//         .catch(err => {
//             loggerService.error('Cannot load user', err)
//             res.status(400).send('Cannot load user')
//         })
// })

// // Auth API
// app.post('/api/auth/login', (req, res) => {
//     const credentials = req.body

//     userService.checkLogin(credentials)
//         .then(user => {
//             if (user) {
//                 const loginToken = userService.getLoginToken(user)
//                 res.cookie('loginToken', loginToken)
//                 res.send(user)
//             } else {
//                 res.status(401).send('Invalid Credentials')
//             }
//         })
//         .catch(err => {
//             loggerService.error('Cannot login', err)
//             res.status(400).send('Cannot login')
//         })
// })

// app.post('/api/auth/signup', (req, res) => {
//     const credentials = req.body

//     userService.save(credentials)
//         .then(user => {
//             if (user) {
//                 const loginToken = userService.getLoginToken(user)
//                 res.cookie('loginToken', loginToken)
//                 res.send(user)
//             } else {
//                 res.status(400).send('Cannot signup')
//             }
//         })
//         .catch(err => {
//             loggerService.error('Cannot signup', err)
//             res.status(400).send('Cannot signup')
//         })
// })

// app.post('/api/auth/logout', (req, res) => {
//     res.clearCookie('loginToken')
//     res.send('logged-out!')
// })


// app.put('/api/user', (req, res) => {
//     const loggedinUser = userService.validateToken(req.cookies.loginToken)
//     if (!loggedinUser) return res.status(400).send('No logged in user')
//     const { diff } = req.body
//     if (loggedinUser.score + diff < 0) return res.status(400).send('No credit')
//     loggedinUser.score += diff
//     return userService.save(loggedinUser)
//         .then(user => {
//             const token = userService.getLoginToken(user)
//             res.cookie('loginToken', token)
//             res.send(user)
//         })
//         .catch(err => {
//             loggerService.error('Cannot edit user', err)
//             res.status(400).send('Cannot edit user')
//         })
// })


// // Fallback route
// app.get('/**', (req, res) => {
//     res.sendFile(path.resolve('public/index.html'))
// })

const PORT = process.env.PORT || 3030
app.listen(PORT)

