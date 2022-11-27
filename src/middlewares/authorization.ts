import {NextFunction, Request, Response} from 'express'
import  Jwt, { JwtPayload }  from 'jsonwebtoken'
import { APP_SECRET } from '../config'
import { UserAttributes, UserInstance} from '../models/userModel'
import { VendorInstance, VendorAttributes} from '../models/vendorModel'

export const auth = async (req: JwtPayload, res: Response, next: NextFunction) =>{
   try {
    const authorization = req.headers.authorization
    if(!authorization){
      return  res.status(401).json({
            message: "Kindly signin as a user"
        })
    }
    const token = authorization.slice(7, authorization.length)
    let verified = Jwt.verify(token, APP_SECRET)
    if(!verified){
        return  res.status(401).json({
            message: "User not authorized"
        })
    }
    const {id} = verified as {[key:string]: string}

    // Find the user by id
    const user = await UserInstance.findOne({where:{id:id}}) as unknown as UserAttributes
    if(!user){
        return  res.status(401).json({
            Error: "Invalid Credentials"
        })
    }
    req.user = verified;
    next()
   } catch (error) {
    return  res.status(401).json({
        Error: "Unaothorized user"
    })
   }
}


export const authVendor = async (req: JwtPayload, res: Response, next: NextFunction) =>{
    try {
     const authorization = req.headers.authorization
     if(!authorization){
       return  res.status(401).json({
             message: "Kindly signin as a user"
         })
     }
     //Bearer encrpttyyyyy
     const token = authorization.slice(7, authorization.length)
     let verified = Jwt.verify(token, APP_SECRET)
     if(!verified){
         return  res.status(401).json({
             message: "User not authorized"
         })
     }
     const {id} = verified as {[key:string]: string}
 
     // Find the vendor by id
     const vendor = await VendorInstance.findOne({where:{id:id}}) as unknown as VendorAttributes
     if(!vendor){
         return  res.status(401).json({
             Error: "Invalid Credentials"
         })
     }
     req.vendor = verified
     next()
    } catch (error) {
     return  res.status(401).json({
         Error: "Unaothorized user"
     })
    }
 }