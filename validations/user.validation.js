const { z } = require("zod");


const searchUserSchema = z.object({

    search: z
        .string()
        .trim()
        .optional(),

    role: z
        .enum([
            "Admin",
            "Moderator",
            "User"
        ])
        .optional(),


    page: z
        .coerce
        .number()
        .min(1)
        .default(1),


    limit: z
        .coerce
        .number()
        .min(1)
        .max(100)
        .default(20),


    sort: z
        .enum([
            "newest",
            "oldest"
        ])
        .default("newest")

});


module.exports = {
    searchUserSchema
};