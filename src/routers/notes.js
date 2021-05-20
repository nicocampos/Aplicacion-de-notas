const router = require('express').Router();

const Note = require('../models/Note')
const { isAuthenticated } = require('../helpers/auth');

router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/new-note');
});

router.post('/notes/new-note', isAuthenticated, async (req, res) => {
    const { title, description } = req.body;
    const errors = [];
    if(!title){
        errors.push({text: 'Inserte un titulo'});
    }
    if(!description){
        errors.push({text: 'Inserte descripcion'});
    }
    if(errors.length > 0){
        res.render('notes/new-note', {
            errors,
            title,
            description
        });
    }
    else{
        const newNote = new Note({ title, description}); // guardo datos
        newNote.user = req.user.id;
        await newNote.save();
        req.flash('success_msg', 'Nota agregada correctamente.')
        res.redirect('/notes');
    }   
});

router.get('/notes', isAuthenticated, async (req, res) => {
    await Note.find({user: req.user.id}).sort({date: 'desc'}).then(documentos => {
        const contexto = {
            notes: documentos.map(documento => {
            return {
                _id: documento.id,
                title: documento.title,
                description: documento.description
            }
          })
        }
        res.render('notes/all-notes', { notes: contexto.notes }) 
      })
});

router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
    const note = await Note.findById(req.params.id).lean();
    res.render('notes/edit-note', {note});
});

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) =>{
    const {title, description} = req.body;
    await Note.findByIdAndUpdate(req.params.id, {title, description});
    req.flash('success_msg', 'Nota editada correctamente.')
    res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated, async(req, res) => {
    await Note.findByIdAndDelete(req.params.id).lean();
    req.flash('success_msg', 'Nota borrada correctamente.')
    res.redirect('/notes');
});

module.exports = router;