import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (userId, res)=>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "15d",
    })
    res.cookie("jwt", token, {
        maxAge: 15*24*60*60*1000, //ms
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== "development",
        
    } )
}


// // token.js
// import jwt from 'jsonwebtoken';

// export const generateTokenAndSetCookie = (userId, res) => {
//   const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
//     expiresIn: '15d',
//   });
//   res.cookie('jwt', token, {
//     maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
//     httpOnly: true,
//     sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none', // Use 'lax' for local, 'none' for production
//     secure: process.env.NODE_ENV !== 'development', // Secure in production
//     path: '/', // Ensure cookie is available site-wide
//   });
// };