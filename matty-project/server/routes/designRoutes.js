const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createDesign, getDesigns, updateDesign, deleteDesign } = require('../controllers/designController');

router.use(authMiddleware); // Protect all routes

router.get('/', getDesigns);
router.post('/', createDesign);
router.put('/:id', updateDesign);
router.delete('/:id', deleteDesign);

module.exports = router;
