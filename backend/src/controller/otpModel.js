// import otpGenerator from "otp-generator"
// import pool from "../db/index.js"
// import mailSender from "../utils/mailSender.js"

// export async function generateAndSendOtp(email){
//     const otp=otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });

//     const expiresAt=new Date(Date.now()+5*60*1000)

//     const connection=await pool.getConnection()

//     try{
//         const createOtpTableQuery = `
//       CREATE TABLE IF NOT EXISTS otps (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         email VARCHAR(255) NOT NULL,
//         otp VARCHAR(6) NOT NULL,
//         createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
//         expiresAt DATETIME
//       );
//     `;

//     await connection.query(createOtpTableQuery);

//     const insertOtpQuery = `
//       INSERT INTO otps (email, otp, expiresAt)
//       VALUES (?, ?, ?)
//     `;

//     await connection.execute(insertOtpQuery, [email, otp, expiresAt]);

//     console.log('OTP inserted into the database')

//     await sendVerificationEmail(email,top);
//     console.log('Verification email sent successfully')
//     }
//     catch(error){
//         console.error('Error genrating or sendign OTP: ',error)
//         throw error;
//     }
//     finally{
//         connection.release()
//     }
// }
