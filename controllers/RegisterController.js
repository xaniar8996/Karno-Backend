const express = require("express");
const bcrypt = require("bcrypt");
const Users = require("../model/Users");

const HandleRegister = async (req, res) => {
    try {
        const { Fullname, email, password } = req.body;

        if (!Fullname || !email || !password) {
            return res.status(400).json({ message: "Fullname , email and password are required !" })
        };

        const Founduser = await Users.findOne({ email }).exec();

        if (Founduser) return res.status(409).json({ success: false, message: "user is already exist !" });

        const hashedPass = await bcrypt.hash(password, 10);

        const RegisterUser = await Users.create({
            Fullname: Fullname,
            email: email, 
            password: hashedPass
        });

        if (RegisterUser) {
            res.status(200).json({ message: `User ${Fullname} Registered Successfully` });
        }

    } catch (error) {
        console.error("❌ Registration error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }


}

module.exports = HandleRegister 