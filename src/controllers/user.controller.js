import { User } from "../models/user.model.js";

const registerUser = async function(req,res)
{
    try
    {
        const {username,email,fullname,password} = await req.body

        if(
            [username,email,fullname,password].some((fields)=>fields?.trim() === "")
        )
        {
            await res.status(400).json({
                message : "All fields required",
            });
            return;
        }

        const userExists = await User.findOne({
            $or : [{username},{email}]
        })

        if(userExists)
        {
            await res.status(400).json({
                message : "User Already Exists",
            })
            return;
        }

        const user = await User.create({username,fullname,email,password});
        const userCreated = await User.findById(user._id).select(
            "-password -refreshToken"
        )
        if(!userCreated)
        {
            await res.status(400).json({
                message : "User Couldn't be created",
            })
            return;
        }

        return res.status(201).json({
            data : userCreated,
            message : "User created Successfully"
        })
    }
    catch(err)
    {
        console.log("Error in controllers file : ",err);
    }
}


export {registerUser};