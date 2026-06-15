import { Router } from "express";
import { 
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote,
} from "../controllers/notesController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// All routes below this line requie a valid token 
router.use(protect);

router.post('/', createNote);
router.get('/', getNotes);
router.get('/:id', getNoteById);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;