import multer from "multer";
import path from "path";
import Tutorials from "../models/tutorialModel.js";

export const uploadTutorial = (req, res) => {
    try {
        const name = "http://192.168.0.37:5000/media/"+ req.file.filename;
        Tutorials.create({
            userId: req.body.userId,
            tutorial_name: req.body.tutorial_name,
            tutorial_description: req.body.tutorial_description,
            name: name,
            data: req.file.mimetype,
        });
        return res.status(201).send("Tutorials Created Successfully");
    } catch (error) {
       res.status(500).send({message: err.message});
    }
}

export const getTutorialId = (req, res) => {
    const t_id = req.params.id;
    Tutorials.findByPk(t_id).then(tutorial => {
     if(!tutorial){
         res.status(404).json({message: "Tutorial Not Found"});
         next();
     } else {
         res.json(tutorial)
     }
    }).catch()
}

export const getAllTutorials = async (req, res) => {
    await Tutorials.findAll().then(data => {
      return res.status(200).send(data);
   });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + '/media')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
 })

export const upload = multer({
    storage: storage,
    limits: {fileSize: '100000'},
    fileFilter: (req, file, cb) => {
        const fileTypes = /mp4|mkv/
        const mimeType = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))

            if(mimeType && extname) {
                return cb(null, true)
            }
            cb('Give proper files formate to upload')
        }
}).single('video');
