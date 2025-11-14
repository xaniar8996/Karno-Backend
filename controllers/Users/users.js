
const Users = require("../../model/Users");

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
}

module.exports = {GetSingleUser , GetAllUsers};