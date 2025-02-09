import exp from "constants"
import { toyService } from "./toy.service.js"



 export async function getToys(req,res) {
    try{
        const filterBy = {
            txt: req.query.txt||'', 
            inStock: ((req.query.inStock==='true')? true:(req.query.inStock==='false')? false:'all'),
             sortBy: req.query.sortBy||'name',
             labels:  req.query.labels||[],
             pageIdx: +req.query.pageIdx||0
        }
        const toys = await toyService.query(filterBy)
        res.json(toys)
    }
    catch(err){
        console.log(err)
        res.status(500).send({ err: 'Failed to get toys' })
    } 
}
export async function getToyById(req, res) {
    try {
        const toyId = req.params.id
        const toy = await toyService.getById(toyId)
        res.json(toy)
    } catch (err) {
        
        res.status(500).send({ err: 'Failed to get toy' })
    }
}

export async function addToy(req,res) {
    try{
        const toy = req.body
        const addedToy = await toyService.add(toy)
      res.json(addedToy)

    }catch(err){
        res.status(500).send({ err: 'Failed to add toy' })
    }
}
export async function updateToy(req,res) {
    try{
        const toy  = { ...req.body, _id: req.params.id }

        const updatedToy = await toyService.update(toy)
       
        res.json(updatedToy)
    }catch(err){
        res.status(500).send({ err: 'Failed to update toy' })
    }
}

export async function removeToy(req,res) {
    try{
       const  toyId = req.params.id
        const deletedCount = await toyService.remove(toyId)
        res.send(`${deletedCount} removed`)
    }catch(err){
        res.status(500).send({ err: 'Failed to remove toy' })
    }
    
}
export async function addToyMsg(req, res) {
    
    const { loggedinUser } = req
    try {
        const toyId = req.params.id
        const msg = {
            txt: req.body.txt,
            by: loggedinUser,
            createdAt: Date.now(),
        }
        const savedMsg = await toyService.addToyMsg(toyId, msg)
        res.json(savedMsg)
    } catch (err) {
        
        res.status(500).send({ err: 'Failed to update car' })
    }
}
