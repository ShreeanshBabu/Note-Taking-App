import { raw } from "express";
import Note from "../models/Note.js";

// CREATE a note
export const createNote = async (req, res) => {
    try {
        const {title, content} = req.body;

        if (!title) {
            return res.status(400).json({message: 'Title is required'});
        }

        const note = await Note.create({
            title,
            content: content || '',
            userId: req.userId,
        });

        res.status(201).json({note});
    } catch (err) {
        res.status(500).json({message: 'Server error', error: err.message});
    }
};

// GET all notes for logged-in user
export const getNotes = async (req, res) => {
    try {
        const notes = await Note.find({userId: req.userId}).sort({updatedAt: -1});
        res.status(200).json({notes});
    } catch (err) {
        res.status(500).json({message: 'Server error', error: err.message});
    }
};

// GET a single note by id
export const getNoteById = async (req, res) => {
    try {
        const note = await Note.findOne({_id: req.params.id, userId: req.userId});

        if (!note) {
            return res.status(404).json({message: 'Note not found'});
        }

        res.status(200).json({note});
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({message: 'Invalid note id'});
        }
        res.status(500).json({message:'Server error', error: err.message});
    }
};

// UPDATE a note
export const updateNote = async (req, res) => {
    try {
        const {title, content} = req.body;

        const note = await Note.findOne({_id: req.params.id, userId: req.userId});

        if (!Note) {
            return res.status(404).json({message: 'Note not found'});
        }

        if (title !== undefined) note.title = title;
        if (content !== undefined) note.content = content;

        await note.save();

        res.status(200).json({note});
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({message: 'Invalid note id'});
        }
        res.status(500).json({message: 'Server error', error: err.message});
    }
};

// Delete a note
export const deleteNote = async (req, res) => {
    try {
        const note = await Note.findOneAndDelete({_id: req.params.id, userId: req.userId});

        if (!note) {
            return res.status(404).json({message: 'Note not found'});
        }

        res.status(200).json({message: 'Note deleted successfully'});
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({message: 'Invalid note id'});
        }
        res.status(500).json({message: 'Server error', error: err.message});
    }
};