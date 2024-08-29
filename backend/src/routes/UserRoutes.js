import express from "express"
import { sendOtp, signupCustomer,signupFleetOwner } from "../controller/auth.js"

const router=express.Router()
router.post('/send-otp',sendOtp)
router.post('/signupCustomer',signupCustomer)
router.post('/signupFleetOwner',signupFleetOwner)

export default router;