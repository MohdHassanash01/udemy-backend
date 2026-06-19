
const {z} = require("zod")


const signupSchema = z.object({

   email:z.string()
    .nonempty({ message: "Email is required" })
        .min(6, { message: "Email must be at least 6 characters long" })
        .max(120, { message: "Email must be less than 120 characters" })
        .email({ message: "Please enter a valid email address" }),

         username: z.string().nonempty({message: "username is required"})
        .min(2, { message: "username must be at least 2 characters long" })
        .max(50,{ message: "username must be at least 20 characters long" }),


        password: z.string()
        .nonempty({ message: "Password is required" })
        .min(5, { message: "Password must be at least 5 characters long"})
        .max(20, { message: "Password must be less than 20 characters" }) 
        .refine(
            (value) => /[A-Z]/.test(value), 
            { message: "Password must contain at least one uppercase letter" }
          )
          .refine(
            (value) => /[a-z]/.test(value), 
            { message: "Password must contain at least one lowercase letter" }
          )
          .refine((value) => /[0-9]/.test(value), {
            message: "Password must contain at least one number"
        })



})


const signinSchema = z.object({

    email : z.string()
      .nonempty({ message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),

    password: z.string()
      .nonempty({ message: "password is required" })
})


const courseSchema = z.object({

        title: 
        z.string()
        .min(3)
        .max(50).nonempty({message: "title is required"}),

         description:
        z.string()
        .min(3)
        .max(100).nonempty({message:"decription is required.."}),

         Price: z.number(),

         img_url: z.string().nonempty({message: "image is required"}),

})


module.exports = {
    signupSchema,
     signinSchema,
     courseSchema
    }