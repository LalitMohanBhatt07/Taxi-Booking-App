import express from "express"
import { signupCustomer,signupFleetOwner } from "../controller/auth.js"

const router=express.Router()

router.post('/signupCustomer',signupCustomer)
router.post('/signupFleetOwner',signupFleetOwner)

export default router;