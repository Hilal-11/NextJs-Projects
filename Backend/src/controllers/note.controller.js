import Note from '../models/note.model.js'
import dotenv from 'dotenv'
dotenv.config();

const createNote = async (req , res) => {
    const { title , discription , color } = req.body;
    if(!title || !discription || color) {
        return res.status(400).json({
            success: false,
            message: ""
        })
    }
    try{
        
        const response = await Note.create({
            title,
            discription,
            color
        })

        res.status(200).json({
            success: true,
            message: "Note created successfully",
            res: response
        })

    }catch(error) {
        return res.status(400).json({
            success: false,
            message: "Faile to create a Note"
        })
    }
}

const getNotes = async (req , res) => {
    try {
        const response = await Note.find({});
        if(!response) {
            return res.status().json({
                success: false,
                message: 'No Note created'
            })
        }
        res.status().json({
            success: true,
            message: "Get all notes",
            res: response
        })
    }catch(error) {
        return res.status(400).json({
            success: false,
            message: "Faile to Get a Notes"
        })
    }
}


export { createNote , getNotes };