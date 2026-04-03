import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.js';
import authRoutes from './routes/authRoutes.js'
import admissionRoutes from'./routes/admissionRoutes.js'
import billingRoutes from './routes/billingRoutes.js'
const app= express();

//Middileware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',authRoutes)

app.use('/api/admissions', admissionRoutes);

app.use('/api/billing', billingRoutes); 

//Routes
app.get('/' , (req,res)=>{
  res.send("API is Working")
})


const PORT =  process.env.PORT || 3000;
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.log("DB Connection Error:", error);
    }
};

startServer();


export default app;