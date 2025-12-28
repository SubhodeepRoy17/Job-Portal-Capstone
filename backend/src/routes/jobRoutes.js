const express = require('express');
const { body } = require('express-validator');
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  applyForJob
} = require('../controllers/jobController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

const router = express.Router();

// Job validation rules
const jobValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('company').notEmpty().withMessage('Company is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('requirements').isArray().withMessage('Requirements must be an array'),
  body('location').notEmpty().withMessage('Location is required'),
  body('salary.min').isNumeric().withMessage('Minimum salary must be a number'),
  body('salary.max').isNumeric().withMessage('Maximum salary must be a number'),
  body('jobType').isIn(['full-time', 'part-time', 'contract', 'internship', 'remote']).withMessage('Invalid job type'),
  body('experienceLevel').isIn(['entry', 'mid', 'senior', 'executive']).withMessage('Invalid experience level'),
  body('category').notEmpty().withMessage('Category is required'),
  body('expiresAt').isISO8601().withMessage('Invalid expiration date')
];

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job management endpoints
 */

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Get all jobs with filters
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for job title, company, or description
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Job location filter
 *       - in: query
 *         name: jobType
 *         schema:
 *           type: string
 *           enum: [full-time, part-time, contract, internship, remote]
 *         description: Type of employment
 *       - in: query
 *         name: experienceLevel
 *         schema:
 *           type: string
 *           enum: [entry, mid, senior, executive]
 *         description: Experience level required
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Job category
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of jobs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 total:
 *                   type: integer
 *                   example: 15
 *                 totalPages:
 *                   type: integer
 *                   example: 3
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 */
router.get('/', getJobs);

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Get a single job by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', getJob);

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Create a new job (Employer/Admin only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - company
 *               - description
 *               - location
 *               - salary
 *               - jobType
 *               - experienceLevel
 *               - category
 *               - expiresAt
 *             properties:
 *               title:
 *                 type: string
 *                 example: Senior Full Stack Developer
 *               company:
 *                 type: string
 *                 example: Tech Corp
 *               description:
 *                 type: string
 *                 example: We are looking for an experienced developer...
 *               requirements:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["React", "Node.js", "MongoDB"]
 *               location:
 *                 type: string
 *                 example: Remote
 *               salary:
 *                 type: object
 *                 properties:
 *                   min:
 *                     type: number
 *                     example: 80000
 *                   max:
 *                     type: number
 *                     example: 120000
 *                   currency:
 *                     type: string
 *                     default: USD
 *               jobType:
 *                 type: string
 *                 enum: [full-time, part-time, contract, internship, remote]
 *                 example: full-time
 *               experienceLevel:
 *                 type: string
 *                 enum: [entry, mid, senior, executive]
 *                 example: senior
 *               category:
 *                 type: string
 *                 example: Technology
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-12-31T23:59:59.000Z
 *     responses:
 *       201:
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized (not employer/admin)
 */
router.post('/', protect, authorize('admin', 'employer'), jobValidation, createJob);

/**
 * @swagger
 * /api/jobs/{id}:
 *   put:
 *     summary: Update a job (Owner or Admin only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *     responses:
 *       200:
 *         description: Job updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       403:
 *         description: Not authorized to update this job
 *       404:
 *         description: Job not found
 */
router.put('/:id', protect, authorize('admin', 'employer'), jobValidation, updateJob);

/**
 * @swagger
 * /api/jobs/{id}:
 *   delete:
 *     summary: Delete a job (Owner or Admin only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Job deleted successfully
 *       403:
 *         description: Not authorized to delete this job
 *       404:
 *         description: Job not found
 */
router.delete('/:id', protect, authorize('admin', 'employer'), deleteJob);

/**
 * @swagger
 * /api/jobs/{id}/apply:
 *   post:
 *     summary: Apply for a job (User only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Application submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Applied successfully
 *       400:
 *         description: Already applied for this job
 *       404:
 *         description: Job not found
 */
router.post('/:id/apply', protect, authorize('user'), applyForJob);

module.exports = router;