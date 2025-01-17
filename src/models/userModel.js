// ##############################################################
// REQUIRE MODULES
// ##############################################################
const pool = require('../services/db');

// ##############################################################
// DEFINE INSERT OPERATION FOR USER
// ##############################################################
module.exports.insertSingle = (data, callback) =>
{
    const SQLSTATMENT = `
    INSERT INTO User (username, email)
    VALUES (?, ?)
    `;
const VALUES = [data.username, data.email];

pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.getUserByEmail = (email, callback) => {
    const SQL_STATEMENT = `
        SELECT * FROM User
        WHERE email = ?
    `;
    const VALUES = [email];

    pool.query(SQL_STATEMENT, VALUES, callback);
}

module.exports.getUserByUsername = (username, callback) => {
    const SQL_STATEMENT = `
        SELECT * FROM User
        WHERE username = ?
    `;
    const VALUES = [username];

    pool.query(SQL_STATEMENT, VALUES, callback);
};

module.exports.insertUserWallet = (data, callback) => {
    const SQL_STATEMENT = `
        INSERT INTO UserWallet (user_id)
        VALUES (?)
    `;
    const VALUES = [data.user_id];

    pool.query(SQL_STATEMENT, VALUES, callback);
};
// ##############################################################
// DEFINE SELECT ALL OPERATIONS FOR USER
// ##############################################################
module.exports.selectAll = (callback) => {
    const SQLSTATMENT = `
    SELECT * FROM User;
    `;

pool.query(SQLSTATMENT, callback);
}

// ##############################################################
// DEFINE SELECT BY ID OPERATIONS FOR USER
// ##############################################################
module.exports.selectById = (data, callback) => {
    const SQL_STATEMENT = `
        SELECT User.user_id, User.username, User.email, SUM(Task.points) AS total_points
        FROM User
        LEFT JOIN TaskProgress ON User.user_id = TaskProgress.user_id
        LEFT JOIN Task ON TaskProgress.task_id = Task.task_id
        WHERE User.user_id = ?
        GROUP BY User.user_id;
    `;
    const VALUES = [data.id];

    pool.query(SQL_STATEMENT, VALUES, callback);
};

module.exports.getGuildByUserId = (userId, callback) => {
    const SQL_STATEMENT = `
        SELECT Guild.guild_name
        FROM Guild
        JOIN GuildMember ON Guild.guild_id = GuildMember.guild_id
        WHERE GuildMember.user_id = ?;
    `;
    const VALUES = [userId];

    pool.query(SQL_STATEMENT, VALUES, callback);
};
// ##############################################################
// DEFINE UPDATE OPERATIONS FOR USER
// ##############################################################
module.exports.updateById = (data, callback) => {
    const SQLSTATMENT = `
    UPDATE User 
    SET username = ?, email = ?
    WHERE user_id = ?;
    `;
const VALUES = [data.username, data.email, data.id];

pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.getUserById = (userId, callback) => {
    const SQL_STATEMENT = `
    SELECT * FROM User 
    WHERE user_id = ?
    `;
    const VALUES = [userId];

    pool.query(SQL_STATEMENT, VALUES, callback);
};

// ##############################################################
// DEFINE DELETE OPERATIONS FOR USER
// ##############################################################
module.exports.deleteById = (data, callback) => {
    const SQL_STATEMENT = `
        DELETE FROM User 
        WHERE user_id = ?;
    `;
    const VALUES = [data.id];

    pool.query(SQL_STATEMENT, VALUES, callback);
};

module.exports.deleteByUserId = (data, callback) => {
    const SQL_STATEMENT = `
        DELETE FROM UserWallet 
        WHERE user_id = ?;
    `;
    const VALUES = [data.id];

    pool.query(SQL_STATEMENT, VALUES, callback);
};

// ##############################################################
// DEFINE SELECT BY ID OPERATIONS FOR USER WALLET
// ##############################################################
module.exports.selectWalletsByUserId = (data, callback) => {
    const SQL_STATEMENT = `
        SELECT UserWallet.wallet_id, UserWallet.balance
        FROM UserWallet
        WHERE UserWallet.user_id = ?;
    `;
    const VALUES = [data.id];

    pool.query(SQL_STATEMENT, VALUES, callback);
};

// ##############################################################
// DEFINE SELECT BY ID OPERATIONS FOR USER INVENTORY
// ##############################################################
module.exports.getUserInventoryById = (userId, callback) => {
    const SQL_STATEMENT = `
    SELECT * FROM UserInventory 
    WHERE user_id = ?
    `;
    const VALUES = [userId];

    pool.query(SQL_STATEMENT, VALUES, callback);
};

// ##############################################################
// DEFINE DELETE OPERATIONS FOR INVENTORY ITEM BY ID
// ##############################################################
module.exports.deleteUserInventoryById = (data, successCallback, errorCallback) => {
    const checkExistenceSQL = `
        SELECT * FROM UserInventory
        WHERE user_id = ? AND inventory_id = ?;
    `;
    const checkExistenceValues = [data.userId, data.inventoryId];

    pool.query(checkExistenceSQL, checkExistenceValues, (error, results) => {
        if (error) {
            errorCallback(error);
        } else {
            if (results.length === 0) {
                // Inventory item not found, so respond with a 404 Not Found status
                errorCallback({
                    message: "Inventory item not found"
                });
            } else {
                // Inventory item found, proceed to delete
                const deleteSQL = `
                    DELETE FROM UserInventory
                    WHERE user_id = ? AND inventory_id = ?;
                `;
                const deleteValues = [data.userId, data.inventoryId];

                pool.query(deleteSQL, deleteValues, (deleteError, deleteResults) => {
                    if (deleteError) {
                        errorCallback(deleteError);
                    } else {
                        successCallback(deleteResults);
                    }
                });
            }
        }
    });
};

module.exports.checkUserExistence = (userId, errorCallback, successCallback) => {
    const SQL_STATEMENT = `
        SELECT * FROM User
        WHERE user_id = ?;
    `;
    const VALUES = [userId];

    pool.query(SQL_STATEMENT, VALUES, (error, results) => {
        if (error) {
            errorCallback(error);
        } else {
            if (results.length === 0) {
                // User not found, so respond with a 404 Not Found status
                errorCallback({
                    message: "User not found"
                });
            } else {
                // User found, execute the success callback
                successCallback();
            }
        }
    });
};