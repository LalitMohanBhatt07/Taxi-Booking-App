import express from "express";
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import mysql from 'mysql2'
import crypto from 'crypto'
import pool from "../db/index.js";

const generateUniqueId=(prefix)=>{
    return prefix + crypto.randomBytes(4).toString('hex').toUpperCase()
}


export const signupCustomer=async(req,res)=>{
    try{
        const {name,email,password,contactNumber,address}=req.body

        if(!name || !email ||!password ||!contactNumber ||!address){
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
        const {name,email,password,contactNumber,address,companyName,superAdminId}=req.body

        if(!name || !email || !password ||!contactNumber ||!companyName ||!address){
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