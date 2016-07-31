## Instructions

An awesome canvas testing project.

### Features
- User can add, edit and remove text from canvas:
    - Add by drag image from image container and drop on canvas board.
    - Add text by click on `Add text` button and click on where to add on canvas board.
    - Edit text by click on text's content.
    - Remove image by right click on it, remove text by clear text's input while editing.
- User can upload image to images list (currently just support `.jpg` and `.png`).
- User can move image and text around canvas : drag & drop.
- Uploaded images list is real-time update.


### On-going
- Remove image in uploaded list.
- Change image.
- Resize image, text.
- Collaboration mode : allow multiple users edit same canvas board, real-time update via websocket.
- text option : color, size, font.
- Export to download.


## Getting start
- install dependencies

    ```
    $ npm install
    ```
-  Run the node server

    ```
    $ npm run start
    ```

- Check my work @ http://localhost:8000

## How to cast magic
- require libraries : `jQuery` and `socket.io`.
    - jQuery : jQuery is one of the most popular javascript libraries, I use to to save time while do select element, add Eventlistener, create new element in DOM. I think it's wasted time to re-write jQuery function by native javascript.
    - socket.io: socket.io is used for handling real-time stuffs, currently I only use it to update images list only. If you don't need it, just add set option `{ disabledRealTimeUpdate : true }` .
- Add `canvas.js` and `item.js` into your project.
- Include in `index.html`, example:

    ```
    <script src="js/item.js"></script>
    <script src="js/canvas.js"></script>
    ```

- In `$(document).ready()`'s callback, trigger `castMagic()` on your `<canvas/>` element.

    ```
    <!-- html -->
    <div class="canvas col-sm-8 col-md-8 col-lg-8">
        <canvas class="block" width="600" height="600">
            <!-- Add images and texts to here -->
        </canvas>
    </div>
    
    <!-- script -->
    <script>
        $(document).ready(function () {
            $('.canvas .block').castMagic({
                imgContainer: '#image', // image that 
                addText: '#addText',
                uploadForm: '#upload-form'
            });
        });
    </script>
    
    ```

## Options

- Available options:

    - __maxImgHeight__: max image's height when add to canvas board.
    - __font__: define font of text.
    - __fontSize__: define font size of text.
    - __imgContainer__: the selector of image pool.
    - __uploadForm__: the selector of upload `<form/>`.
    - __addText__: the selector of add text `button`.
    - __disabledRealTimeUpdate__: stop using real-time update.
   
- Default options:  

    ```
     {   
        maxHeight: 200,
        font: 'Arial',
        fontSize: 30,
        imgContainer: '#imageContainer',
        uploadForm: '#uploadBtn',
        addText: '#addTextBtn',
        disabledRealTimeUpdate : false
    };
    ```
    
    
