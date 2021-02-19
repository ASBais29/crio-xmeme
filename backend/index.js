const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const mongoose = require('mongoose');
const memes = require('./routes/memes');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json())
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            version: "1.0.0",
            title: "xMeme API",
            description: "Get all memes",
            servers: ["http://localhost:8081/memes"]
        }
    },
    apis: ["index.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/swagger-ui/", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//Swagger defined for GET POST and PATCH requests
/**
 * @swagger
 * /memes:
 *  get:
 *    description: Fetch all memes.
 *    responses:
 *      '200':
 *        description: A successful response
 */

/**
 * @swagger
 * /memes:
 *   post:
 *     description : Add new meme
 *     parameters:
 *     - name: Inputs
 *       description: Name of owner,caption and URL of meme
 *       in: body
 *       required: true
 *       type: string
 *     responses:
 *       201:
 *         description: Success
 *       409:
 *         description: Duplicate value exist
 *       500:
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /memes/{id}:
 *   patch:
 *     description : Update meme
 *     parameters:
 *     - name: id
 *       description: Meme ID
 *       in: path
 *       required: true
 *       type: string
 *     - name: Fields to be updated
 *       description: Update the meme (URL/caption)
 *       in: body
 *       required: true
 *       type: string
 *     responses:
 *       204:
 *         description: Updated Successfully
 *       404:
 *         description: Not Found
 */

// Routes
app.use('/memes', memes);

app.get('/', (req, res) => {
    res.send('Welcome to xMEME backend')
})

const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser:true, useFindAndModify:false, useCreateIndex:true, useUnifiedTopology:true} )
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("Database connected successfully!")
})

app.listen(8081, () => {
    console.log('Listening on https://localhost:8081/memes');
    console.log('SwaggerUI on https://localhost:8081/swagger-ui');
})
