var express = require('express')
var router = express.Router();
const Note =  require('../models/note.js');
const withAuth = require('../middlewares//auth.js')
const CircularJSON = require('circular-json');

router.post('/', withAuth, async (req, res) => {
    const { title, body } = req.body;
    let note = new Note({ title: title, body: body, author: req.user._id})
    try {
        await note.save();
        res.status(200).json(note)
    }catch (error) {
        res.status(500).json({error: 'Problem to create a new note'})
    }
})

router.get( '/search', withAuth, async (req, res) => {
    const { query } = req.query
    try {
        let notes = await Note 
        .find({ author: req.user._id})
        .find({ $text: {$search: query}})
        res.json(notes)
    } catch (error) {
        res.status(500).json({error: 'Problem to create a new note'})
    }
})

router.get('/:id', withAuth, async (req, res) => {
    try {
        const { id } = req.params
        let note = await Note.findById(id)
        if(isOwner(req.user, note))
            res.json(note)
        else 
        res.status(403).json({error: 'permission denied'})       
    } catch (error) {
        res.status(500).json({error: 'Problem to create a new note'})
    }

})

router.get('/', withAuth, async (req, res) => {
    try {
        let notes = await Note.find({author: req.user._id})
        res.json(notes)
    } catch (error) {
        res.json({error: error}).status(500)
    }

})

router.put('/:id', withAuth, async (req, res) => {
    const { title, body} = req.body
    const { id } = req.params
    try {
        let note = await Note.findById(id)
        if(isOwner (req.user, note)) {
            let note = await Note.findOneAndUpdate(
                { _id: id },
                { $set: { title: title,  body: body } },
                { upsert: true, 'new': true } 
            )
               return res.json(note);
            }
        else
         return res.status(403).json({error: 'permission denied'})
        console.log(error)     
    } catch (error) {
        return res.status(500).json({error: 'Problem to update a note '}) 
        console.log(error)
    }
})

router.delete('/:id', withAuth, async (req, res) => {
    const { id } = req.params
    try {
        let note = await Note.findById(id)
        if(isOwner(req.user, note)){
            await Note.deleteOne({ _id: id });
            res.json({message:'ok'}).status(204)
        } else 
        res.status(403).json({error: 'permission denied'})  
    } catch (error) {
        res.status(500).json({error: 'Problem to delete a note'})
    }
})

const isOwner = (user, note) => {
    if(JSON.stringify(user._id) == JSON.stringify(note.author._id))
    return true
    else 
    return false 
}


module.exports = router 