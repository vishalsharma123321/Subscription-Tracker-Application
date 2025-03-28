import User from '../models/user.model.js';

export const getUSers =  async (req,res,next)=>{
    try {
        const users = await User.find();
        res.status(200).json({
            success:true,
            data:users
        })
    } catch (error) {
        next(error)
    }
}
export const getUser = async (req, res, next) => {
    try {

        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        // Check if the logged-in user is trying to access their own data
        // req.user is set by the authorization middleware and contains the logged-in user's details
        /*
        req.user._id is an ObjectId (ObjectId("65f9b4567e1a2b3c4d5e6f78")).
        req.params.id is a string ("65f9b4567e1a2b3c4d5e6f78").
        If we don’t use .toString(), JavaScript may not compare them correctly.
        Using .toString() ensures we are comparing two strings, avoiding mismatches.
        */
        if (req.user._id.toString() !== req.params.id) {
            return res.status(403).json({
                success: false,
                message: "Access denied! You are not authorized to view this user's data."
            });
        }

        // If everything is fine, return the user data (excluding password)
        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        // Pass any error to the error-handling middleware
        next(error);
    }
};
