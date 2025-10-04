const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { 
  createDesign, 
  getDesigns, 
  getDesignById, 
  updateDesign, 
  deleteDesign 
} = require('../controllers/designController');

// Protect all design routes
router.use(authMiddleware);

// GET all designs for user
router.get('/', getDesigns);

// GET single design by ID
router.get('/:id', getDesignById);

// CREATE new design
router.post('/', createDesign);

// UPDATE (overwrite) a design by ID
router.put('/:id', updateDesign);

// DELETE a design by ID
router.delete('/:id', deleteDesign);

module.exports = router;
