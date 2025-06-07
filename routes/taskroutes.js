import express from 'express';
import {getAllTasks, createTask, deleteTask, editTask} from '../controllers/taskcontrollers.js';


const router = express.Router();

router.get('/', getAllTasks);
router.post('/create-task', createTask);
router.delete('/delete-task/:id', deleteTask);
router.put('/edit-task/:id', editTask);

export default router;
