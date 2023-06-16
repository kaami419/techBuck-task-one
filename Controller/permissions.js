const Permission = require("../Models/Permissions");

const createPermission = async (event) => {
    const {isSeller, isBuyer,isAdmin} = JSON.parse(event.body)

    try {
        const permission = await Permission.create({isSeller, isBuyer, isAdmin})
        return{
            statusCode: 201,
            header: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({permission})
           
        }

    } catch (error) {
        console.log(error);
        return{
            statusCode: 500,
            body: JSON.stringify({message: "Internal Server Error"})
        }
    }
}

const getPermissions = async (event) => {
    try {
        const permission = await Permission.findAll()
        return{
            statusCode: 200,
            header: {
                "Content-Type" : "application/json",
            },
            body: JSON.stringify({permission})
        }
    } catch (error) {
        console.log(error);
        return{
            statusCode: 500,
            body: JSON.stringify({message: "Internal Server Error"})
        }
        
    }
}

const updatePermission = async (event) => {
    const { id } = event.pathParameters;
    const { isSeller, isBuyer,isAdmin } = JSON.parse(event.body)
    try {
        const permission = await Permission.findOne({ where: { id } })
        if (!permission) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "Permission not found" })
            }
        }
        await Permission.update(
            { isSeller, isBuyer,isAdmin  },
            { where: { id } }
        )
        const updatedPermission = await Permission.findOne({ where: { id }, attributes: ["isSeller", "isBuyer","isAdmin"] })
        return {
            statusCode: 200,
            body: JSON.stringify({message: "permission updated", permisson: updatedPermission.dataValues}),
        };


    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error" })
        }

    }
}

const deletePermission = async (event) => {
    const { id } = event.pathParameters;

    try {
        const permission = await Permission.findOne({where: {id}})
        if (!permission) {
            return {
                statusCode: 404,
                body: JSON.parse({ message: "Permission not found" })
            }
        } else {
            await permission.destroy({where: {id}, attributes: ["isSeller", "isBuyer","isAdmin"]})
            return {
                statusCode: 200,
                body: JSON.stringify({ message: "permission deleted", permission: permission.dataValues}),
            };
        }

    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error" })
        }

    }
}




module.exports = {createPermission, getPermissions, updatePermission, deletePermission}