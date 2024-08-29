import express from "express";
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import mysql from 'mysql2'
import crypto from 'crypto'
import pool from "../db/index.js";
import otpGenerator from "otp-generator";
import mailSender from "../Utils/mailSender.js"
import otpTemplate from "../mails/emailVerificationTemplate.js";

const generateUniqueId=(prefix)=>{
    return prefix + crypto.randomBytes(4).toString('hex').toUpperCase()
}

export async function sendOtp(req,res) {
    const {email,accountType}=req.body;

    if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      const connection=await pool.getConnection()
  try {
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false,lowerCaseAlphabets:false, specialChars: false });
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const createOtpTableQuery = `
    CREATE TABLE IF NOT EXISTS otps (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      otp VARCHAR(6) NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      expiresAt DATETIME
    );
  `;

  await connection.query(createOtpTableQuery);

  const [userPresent]=await pool.query(`SELECT * FROM ${accountType} WHERE email = ?`,[email])

  if(userPresent.length>0){
    return res.status(401).json({
        success:false,
        message:"User already Registered"
    })
  }
  
  const insertOtpQuery = `
      INSERT INTO otps (email, otp, expiresAt)
      VALUES (?, ?, ?)
    `;

    await connection.execute(insertOtpQuery, [email, otp, expiresAt]);

    await mailSender(email, 'Verification Email from Cola Cuber',otpTemplate(otp));

    console.log('OTP inserted into the database and email sent successfully');


  res.status(200).json({
    success:true,
    message:"OTP sent Successfully",otp
  })

  
  } catch (error) {
    console.error('Error generating or sending OTP: ', error);
    throw error;
  } finally {
    connection.release();
  }
}


export const signupCustomer=async(req,res)=>{
    try{
        const {name,email,password,contactNumber,address,otp}=req.body

        if(!name || !email ||!password ||!contactNumber ||!address ||!otp){
            return res.status(400).json({
                success:false,
                message:"All Fields are mandatory"
            })
        }

        const [existingUser]=await pool.query('SELECT * FROM customer WHERE email = ?',[email]);

        if(existingUser.length>0){
            return res.status(400).json({
                success:false,
                message:"User already exist !"
            })
        }

        const [otpRecord]=await pool.query('SELECT * FROM otps WHERE email = ? ORDER BY createdAt DESC LIMIT 1',[email])

        if (otpRecord.length === 0) {
            return res.status(400).json({
              success: false,
              message: "OTP not found or expired. Please request a new OTP.",
            });
          }

          if (otpRecord[0].otp !== otp) {
            return res.status(400).json({
              success: false,
              message: "Invalid OTP. Please try again.",
            });
          }

        const passwordHash=await bcrypt.hash(password,10)

        const customerId=generateUniqueId('C')


        await pool.query('INSERT INTO customer (customerId,name,email,passwordHash,contactNumber,address,created_at,updated_at) VALUES (?,?,?,?,?,?,NOW(),NOW())',[customerId,name,email,passwordHash,contactNumber,address])

        const [newCustomer] = await pool.query('SELECT customerId, name, email, contactNumber, address FROM customer WHERE customerId = ?', [customerId]);

        return res.status(201).json({
            success:true,
            message:"Customer registered successfully",
            newCustomer
        })
    }
    catch(err){
        console.error('Error during signup:', err);
    res.status(500).json({ message: 'Internal Server Error' ,
        error:err.message

    });
    }
}

export const signupFleetOwner=async(req,res)=>{
    try{
        const {name,email,password,contactNumber,address,companyName,superAdminId,otp}=req.body

        if(!name || !email || !password ||!contactNumber ||!companyName ||!address ||!otp){
            return res.status(400).json({
                success:false,
                message:"All fields are mandatory"
            })
        }

        const [existingUser]=await pool.query('SELECT * FROM fleetowner WHERE email =?',[email])

        if(existingUser.length>0){
            return res.status(400).json({
                success:false,
                message:"user already exist"
            })
        }

        const [otpRecord]=await pool.query('SELECT * FROM otps WHERE email = ? ORDER BY createdAt DESC LIMIT 1',[email])

        if (otpRecord.length === 0) {
            return res.status(400).json({
              success: false,
              message: "OTP not found or expired. Please request a new OTP.",
            });
          }

          if (otpRecord[0].otp !== otp) {
            return res.status(400).json({
              success: false,
              message: "Invalid OTP. Please try again.",
            });
          }


        const passwordHash=await bcrypt.hash(password,10)
        const fleetOwnerId=generateUniqueId('F')

        await pool.query(
            'INSERT INTO fleetowner (fleetOwnerId,name,email,passwordHash,contactNumber,companyName,address,created_at,updated_at) VALUES (?,?,?,?,?,?,?,NOW(),NOW())',[fleetOwnerId,name,email,passwordHash,contactNumber,companyName,address]
        )

       const [newFleetOwner]=await pool.query('SELECT fleetOwnerId, name, email, contactNumber,companyName, address FROM fleetowner WHERE fleetOwnerId = ?', [fleetOwnerId])

        return res.status(201).json({
            success: true,
            message: "Fleet Owner registered successfully",
            newFleetOwner
            
        });
    }
    catch(error){
        console.error('Error during signup:', error);
    res.status(500).json({ message: 'Internal Server Error' ,
        error:error.message

    });
    }
}

export const signupDriver=async(req,res)=>{
    try{
       
    }
    catch(err){
        console.error('Error during signup:', err);
    res.status(500).json({ message: 'Internal Server Error' ,
        error:err.message

    });
    }
}