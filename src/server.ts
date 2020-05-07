import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
const { query } = require('express-validator/check');
const { validationResult } = require('express-validator');


(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( 
    "/",
    async ( req: any, res: any ) => {
      return res.status(200).send('index');
  });

  app.get( 
      "/api/v0/filter_image",
      [
        query('image_url').exists().withMessage('parameter image_url is required'),
        query('image_url').not().isEmpty().withMessage('parameter image_url should not null')
      ],
      async ( req: any, res: any ) => {
        const errors = validationResult(req);
        let filteredImage : string;

        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        } 
        
        await filterImageFromURL(req.query.image_url).then( path => {
          filteredImage = path;
          res.sendFile(path)
        });

        res.on('finish', function(){
          deleteLocalFiles([filteredImage]);
        });        

  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();