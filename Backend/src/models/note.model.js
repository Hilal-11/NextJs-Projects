import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
    id: { type: String},
    title: { type: String, required: true, trim: true},
    discription: { type: String , required: true, trim: true},
    color: { type: String , trim: true , default: '#ffffff'},
    mediaUpload: { type: String, trim: true, }
}, { timestamps: true})

export default mongoose.model("Note" , NoteSchema)