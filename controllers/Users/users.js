const Users = require("../../model/Users");
const logger = require("../../config/logger");

const GetSingleUser = async (req, res) => {
    const { id } = req.body;

    if (!id) return res.status(401).json({ success: false, message: "user id is required !" });

    try {
        const SingleUser = await Users.findById(id);
        

        if (!SingleUser) return res.status(404).json({ success: false, message: "User not found !" });

        return res.status(200).json({ success: true, message: "User found successfully !", data: SingleUser });

    } catch (err) {
        return res.status(500).json({ success: false, message: `Failed to get user with id ${id}` });
    }
}

const GetAllUsers = async (req, res) => {
    try {
        const AllUsers = await Users.find();

        if (!AllUsers) return res.status(404).json({ success: false, message: "Failed to fetch users !" });

        return res.status(200).json({ success: true, message: "Users fetched successfully !", data: AllUsers });

    } catch (err) {
        return res.status(500).json({ success: false, message: `Failed to get users` });
    }
};

const DeleteUser = async (req, res) => {
    const { _id, username } = req.body;

    if (!_id) {
        return res.status(400).json({
            success: false,
            message: "User id is required !",
        });
    }

    try {
        const user = await Users.findById(_id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found !",
            });
        }

        await Users.findByIdAndDelete(_id);

        logger.info({
            event:"USER_DELETED",
            deletedUser: user._id,
            username: user.Fullname,
            Fullname:user.createdAt,
            ip: req.ip,
        });

        return res.status(200).json({
            success: true,
            message: `User ${username || ""} deleted successfully !`,
        });

    } catch (error) {
        logger.error({
            event: "USER_DELETED_FAILED",
            message: error.message,
            stack: error.stack,
            ip: req.ip,
         });

        return res.status(500).json({
            success: false,
            message: "Failed to delete user",
            error: err.message,
        });
    }
};

const UpdateUser = async (req, res) => {
    const { _id, ...updateData } = req.body;

    if (!_id) {
        return res.status(400).json({
            success: false,
            message: "User id is required !",
        });
    }

    try {
        const user = await Users.findById(_id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found !",
            });
        }

        const updatedUser = await Users.findByIdAndUpdate(
            _id,
            { $set: updateData },
            { new: true }
        );

        logger.info({
            event:"USER_UPDATED",
            updatedUser: updatedUser._id,
            username: updatedUser.Fullname,
            Fullname:updatedUser.createdAt,
            ip: req.ip,
        });

        return res.status(200).json({
            success: true,
            message: "User updated successfully !",
            data: updatedUser,
        });

    } catch (error) {
        logger.error({
            event: "USER_UPDATE_FAILED",
            message: error.message,
            stack: error.stack,
            ip: req.ip,
         });

        return res.status(500).json({
            success: false,
            message: "Failed to update user",
            error: err.message,
        });
    }
};


module.exports = { GetSingleUser, GetAllUsers , DeleteUser , UpdateUser };