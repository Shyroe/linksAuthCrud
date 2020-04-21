const express = require('express');
const router = express.Router();

const knex = require('../data/db') //Import query knex

const { isLoggedIn } = require('../lib/auth')


router.get('/add', (req, res) => {
    res.render('links/add');
});

    //Get All Links
router.get('/', isLoggedIn, async (req, res) => {   
    // const links = await knex('links') //Exibe todos os links criados.
    const links = await knex('links').where('user_id', req.user.id) //Exibe apenas os links do usuário logado
    res.render('links/list', { links })
});

// Create Favorite Link
router.post('/add', async (req, res) => {
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description,
        user_id: req.user.id
    };
    
   const createLink = await knex('links').insert(newLink);
   
    req.flash('success', 'Link Saved Successfully');
    res.redirect('/links');
});

//Delete Link
router.get('/delete/:id', async (req, res) => {
    const { id }  = req.params;
    const link = await knex('links').where('id', id).del()
     console.log('Deleted Link ', link)  
    //Message
    req.flash('success', 'Link Removed Successfully')   

    res.redirect('/links');
})


//Capturar Current Link
router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    // const links = await pool.query('SELECT * FROM links WHERE id = $1', [id]);
    const link = await knex('links').where('id', id).first()
    
    console.log('CurrentLink: ', link);
    res.render('links/edit', {link: link});
});

// Update Link
router.put('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, url} = req.body; 
    const newLink = {
        title,
        description,
        url
    };

    const link = await knex('links').where('id', id).update(newLink);

    req.flash('success', 'Link Updated Successfully');
    res.redirect('/links');
});

module.exports = router;