const express = require('express');
const mongoose = require('mongoose');
let Meme = require('../models/memes')
let router = express.Router();

// Make sure there is no empty field in input
function memeValidation(meme) {
    return meme.name && meme.name.toString().trim() !== '' &&
        meme.url && meme.url.toString().trim() !== ''
}

//Router to GET latest 100 memes
router.get('/', (req, res) => {

    Meme.find().limit(100)
        .then(memes => {
            let meme_array = new Array();
            memes.map((m) => {
                let data = {
                    id: m._id,
                    name: m.name,
                    url: m.url,
                    caption: m.caption
                }
                meme_array.push(data);
            })
            meme_array.reverse();
            res.status(200).json(meme_array); //200: SUCCESS get all memes
        })
        .catch(err => res.status(404).send(err)) //404: Memes not found
})

//Router to POST a meme
router.post('/', (req, res) => {

    console.log(req.body.name);

    if (!memeValidation(req.body)) return res.status(406).send({ //406: NOT ACCEPTABLE for incomplete inputs
        "Error": "Name/URL not filled!"
    })

    Meme.exists({ name: req.body.name }, function(err, ret) {
        if (err) return console.log(err);
        else
        if (ret) return res.status(409).send({ //409: Error for meme owner duplication
            "Error": "Owner name already present!"
        })
        const meme = new Meme({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            url: req.body.url,
            caption: req.body.caption
        })
        meme.save()
            .then(result => {
                res.status(201).json({ //201: Meme created    
                    id: meme._id
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).send({ //500: Internal Server Error
                    err: err
                })
            });
    })
})

//Router to GET meme by /:id
router.get('/:id', (req, res) => {

    Meme.find({ _id: req.params.id })
        .then(content => {
            res.status(200).send({ //200: Meme Found
                id: content[0].id,
                name: content[0].name,
                url: content[0].url,
                caption: content[0].caption
            })
        })
        .catch(err => res.status(404).send(err)); //404: Meme not found

})

// PATCH Router to update a meme by id 
router.patch('/:id', (req, res) => {

    Meme.findByIdAndUpdate(req.params.id, req.body,
        function(err, docs) {
            if (err) res.status(404).send('Meme not found.'); //404: Meme not found
            else {
                if (docs === null) res.status(404).send();
                else {
                    res.status(200).send('Meme updated.'); //200: Meme Updated
                }
            }
        })
})


module.exports = router;