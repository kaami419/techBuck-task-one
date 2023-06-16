const Permission = require("../Models/Permissions");
const Role = require("../Models/Roles");

const createRoles = async (event) => {
    const { role_name, permission_id } = JSON.parse(event.body)
    

    try {
        const permission = await Permission.findByPk(permission_id)

        if(!permission){
            return {
                statusCode: 404,
                body: JSON.stringify({message: "Permission not found"})
            }
        }
        const role = await Role.create({ role_name, permission_id })
        return {
            statusCode: 201,
            header: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ role })

        }

    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error" })
        }
    }
}

const getRoles = async (event) => {
    try {
        const roles = await Role.findAll()
        return {
            statusCode: 200,
            header: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ roles })
        }
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error" })
        }

    }
}

const updateRole = async (event) => {
    const { id } = event.pathParameters;
    const { role_name, permission_id } = JSON.parse(event.body)
    try {
        const permission = await Permission.findByPk(permission_id)

        if(!permission){
            return {
                statusCode: 404,
                body: JSON.stringify({message: "Permission not found"})
            }
        }
        const role = await Role.findOne({ where: { id } })
        if (!role) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "Role not found" })
            }
        }
        await Role.update(
            { role_name, permission_id },
            { where: { id } }
        )
        const updatedRole = await Role.findOne({ where: { id }, attributes: ['role_name', 'permission_id'] })
        return {
            statusCode: 200,
            body: JSON.stringify(updatedRole.dataValues),
        };


    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error" })
        }

    }
}

const deleteRole = async (event) => {
    const { id } = event.pathParameters;

    try {
        const role = await Role.findOne({where: {id}})
        if (!role) {
            return {
                statusCode: 404,
                body: JSON.parse({ message: "Role not found" })
            }
        } else {
            await Role.destroy({where: {id}, attributes: ['role_name', 'permission_id']})
            return {
                statusCode: 200,
                body: JSON.stringify({ message: "role deleted", role: role.dataValues}),
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



module.exports = { createRoles, getRoles, updateRole, deleteRole }