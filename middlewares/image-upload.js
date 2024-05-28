const multer = require('multer')
const uuid = require('uuid').v4;

const upload = multer({
    storage: multer.diskStorage({
        destination: 'product-data/images',
        filename: function(req, file, cb) {
            cb(null, uuid() + '-' + file.originalname);
        }
    })
});

const configuredMulterMiddleware = upload.single('image'); //image指new-produc.ejs里name="image"的image

module.exports = configuredMulterMiddleware;

// const storageConfig = multer.diskStorage({
//     destination: function(req, file, cb) {
//       cb(null, 'images');//第一个参数指的是error， 第二个指images文件夹
//     }, //cb:callback
//     filename:function(req, file, cb) {
//       cb(null, Date.now() + '-' + file.originalname);
//     }
//   });
  
//   //const upload = multer({dest: 'images'});//images指的只文件夹images
//   const upload = multer({ storage: storageConfig });
//   const router = express.Router();


//   router.post('/profiles', upload.single('image'), async function(req,res) {
//     //single('image') - image指的是new-user.ejs里input里name = "image"
//     const uploadedImageFile = req.file;
//     const userData = req.body;
  
//     // console.log(uploadedImageFile);
//     // console.log(userData);
//     await db.getDb().collection('users').insertOne({
//       name: userData.username,
//       imagePath: uploadedImageFile.path
//     });
  
//     res.redirect('/');
  
//   });
  