
/** A MODULE to manage the User model.
 * in future examples, we will use a database to store data.
 */
module.exports = class User {
    constructor(email, firstName, lastName, password) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
    }

    /** Save the product to a file.
     * @throws {Error} if the product already exists or if the product has no title.
     * */
    save() {
        if (!this.email || !this.firstName || !this.lastName || !this.password) {
            throw new Error('User must have a title, price and id');
        }
        if (userList.find((item) => item.email === this.email)) {
            console.log(userList)
            return false;
        }
        userList.push(this);

        return true;
    }

    /** Fetch all products from the file.
     * @returns {Array} an array of users.
     */
    static fetchAll() {
        return (userList);
    }

    static getLength() {
        return userList.length;
    }
};

/*
 this example stores the model in memory. Ideally these should be stored
 persistently in a database.
 */
let userList = [];

