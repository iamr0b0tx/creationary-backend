import dotenv from "dotenv"
dotenv.config()
import express from "express"
import type { Application, Request, Response, NextFunction } from "express"

const app: Application = express()

app.use(express.json())


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Error encountered: ", err)

    res.status(err.status || 500).json({
        status: "error",
        message: err.message || "Internal Server Error"
    })
})


export default app