const mongoose = require("mongoose");
const { Schema } = mongoose;

const CVModel = new Schema({
    id:{
        type:String,
        required:true,
        index: true, // Add index for faster queries
    },
    template:{
        type:String,
        default:"",
        required: true
    },
    personal: {
        Image: String,
        fullName: {
            type: String,
            required: true
        },
        about: String,
        email: String,
        jobTitle: String,
        phone: String,
        address: String,
    },
    
    certificate: [{
        CourseName: {
            type: String,
            required: true,
            trim: true
        },
        Date: String,
    }],
    
    education: [{
        institute: {
            type: String,
            required: true,
            trim: true
        },
        dateRange: String,
        degree: String,
        description: String,
    }],
    
    experiences: [{
        company: {
            type: String,
            required: true,
            trim: true
        },
        jobTitle: {
            type: String,
            required: true,
            trim: true
        },
        dateRange: String,
        description: String,
    }],
    
    interests: [{
        Description: String,
    }],
    
    languages: [{
        languageName: {
            type: String,
            required: true,
            trim: true,
        },
        level: {
            type: String,
            required: true,
        },
    }],
    
    projects: [{
        title: {
            type: String,
            required: true
        },
        technologies: [String], // Array of strings
        link: String,
        github: String,
        description: String,
    }],
    
    skills: [{
        name: {
            type: String,
            required: true
        },
        level: String
    }],
    
    socialLink: [{
        platform: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }]
},);

module.exports = mongoose.model("CV", CVModel);