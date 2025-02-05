
import fs from 'fs'
import { utilService } from './util.service.js'


export const toyService = {
    query,
    getById,
    remove,
    save,
    getAllToys
}

 const PAGE_SIZE = 6
const toys = utilService.readJsonFile('data/toy.json')
function getAllToys(){
    return   Promise.resolve(toys)
}
function query(filterBy = {}) {
    
        if (!filterBy.txt) filterBy.txt = ''
        const regExp = new RegExp(filterBy.txt, 'i')
        let toysToreturn = toys.filter(toy =>
            regExp.test(toy.name) && (filterBy.inStock === 'all' || filterBy.inStock === toy.inStock) )
            if (filterBy.labels && filterBy.labels.length) {
                toysToreturn = toysToreturn.filter(
                    toy => filterBy.labels.some(label => toy.labels.includes(label))
                    //filterBy.labels.every(label => toy.labels.includes(label))
                )
              }
        if(filterBy.sortBy === 'name'){
            toysToreturn = toysToreturn.sort((t1, t2) => t1.name.localeCompare(t2.name))

        }else if(filterBy.sortBy === 'price'){
            toysToreturn = toysToreturn.sort((t1, t2) => t1.price - t2.price)

        }else{
            toysToreturn = toysToreturn.sort((t1, t2) => t1.createdAt - t2.createdAt)
        }
        const toysToreturnLength = toysToreturn.length
        
        if (filterBy.pageIdx !== undefined) {
          const startIdx = filterBy.pageIdx * PAGE_SIZE
          toysToreturn = toysToreturn.slice(startIdx, startIdx + PAGE_SIZE)
        }
      
        return Promise.resolve(getMaxPage(toysToreturnLength)).then(maxPage => {
          return { toys: toysToreturn, maxPage }
        })
    
}

function getById(toyId) {
    const toy = toys.find(toy => toy._id === toyId)
    return Promise.resolve(toy)
}

function remove(toyId) {
    const idx = toys.findIndex(toy => toy._id === toyId)
    if (idx === -1) return Promise.reject('No Such toy')

    toys.splice(idx, 1)
    return _saveToysToFile()
}

function save(toy) {
    if (toy._id) {
        const toyToUpdate = toys.find(currToy => currToy._id === toy._id)
        toyToUpdate.name = toy.name
        toyToUpdate.inStock = toy.inStock
        toyToUpdate.price = toy.price
        toyToUpdate.labels = toy.labels
        toy = toyToUpdate
    } else {
        toy._id = utilService.makeId()
        toys.push(toy)
    }
    
    return _saveToysToFile().then(() => toy)
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