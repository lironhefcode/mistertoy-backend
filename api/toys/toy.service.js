
import fs from 'fs'
import { utilService } from '../../services/util.service.js'
import { dbService } from '../../services/db.service.js'


export const toyService = {
    query,
    getById,
    remove,
    add,
    update,
    getAllToys,
    addToyMsg
}

 const PAGE_SIZE = 6

async function getAllToys(){
    const collection = await dbService.getCollection('toyDB')
            let toys =  await collection.find().toArray
            return toys
}
async function query(filterBy = {}) {
        try{
            const criteria={
                name: { $regex: filterBy.txt, $options: 'i' },
                
            }
            if(filterBy.inStock !== 'all'){
                criteria.inStock ={$eq : filterBy.inStock}
            }
            if (filterBy.labels.length !==0){
                criteria.labels = {$in:filterBy.labels}
            }
            const collection = await dbService.getCollection('toyDB')
            let toys =  await collection.find(criteria).sort({[filterBy.sortBy]:1}).limit(PAGE_SIZE).skip(filterBy.pageIdx * PAGE_SIZE).toArray()   
            return {toys,maxPgae:1}
        }
        catch(err){
            console.log(err)
        }  
}

async function getById(toyId) {
    try{

        const collection = await dbService.getCollection('toyDB')
        const toy = await collection.findOne({_id:{$eq:toyId}})
        return toy
    }catch(err){
        console.log(err)
    }
}

async function remove(toyId) {
    try{
        const collection = await dbService.getCollection('toyDB')
      const {deleteCount} =  await  collection.deleteOne({_id:toyId})
      return deleteCount
    }catch(err){
        console.log(err)
    }
}

async function update(toy) {
    try{
        const collection = await dbService.getCollection('toyDB')
        const toyToUpdate= {
            name : toy.name,
            inStock : toy.inStock,
            price :toy.price,
            labels : toy.labels,
        }
        collection.updateOne({_id:toy._id},{$set:toyToUpdate})
        return toyToUpdate
    }catch(err){
        console.log(err)
        throw err
    }
}


async function add(toy) {
    try{
        toy._id = utilService.makeId()
        const collection = await dbService.getCollection('toyDB')               
        collection.insertOne(toy)       
        return toy
    }catch(err){
        console.log(err)
    }
}
async function addToyMsg(toyId, msg) {
	try {
		msg.id = utilService.makeId()

		const collection = await dbService.getCollection('toyDB')
		await collection.updateOne({ _id: toyId }, { $push: { msgs: msg } })
		return msg
	} catch (err) {
		
		throw err
	}
}

function _saveToysToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(toys, null, 2)
        fs.writeFile('data/toy.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}
function getMaxPage(filteredToysLength) {
    if (filteredToysLength) {
      return Promise.resolve(Math.ceil(filteredToysLength / PAGE_SIZE))
    }
    return Promise.resolve(Math.ceil(toys.length / PAGE_SIZE))
  }