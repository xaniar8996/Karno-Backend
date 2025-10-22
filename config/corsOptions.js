const whiteList = require("./Allowedorgins")

    const CorsOptions = {
        origin:(origin , callback) => {
            if(whiteList.indexOf(origin) !== -1 || !origin){
                callback(null , true)
            }else{
                callback(new Error ("Not allowed by CORS"))
            }
        },
        optionsSucessStatus:200
    };

    module.exports = CorsOptions