
/** A MODULE to manage the User model.
 * in future examples, we will use a database to store data.
 */

module.exports = class User {
    constructor(email, firstName, lastName) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    /** Save the product to a file.
     * @throws {Error} if the product already exists or if the product has no title.
     * */

    save() {
        if (!this.email || !this.firstName || !this.lastName) {
            throw new Error('User must have a title, price and id');
        }
        if (userList.includes(this.email)) {
            throw new Error('User already exists');
        }
        console.log(this.email)
        userList.push(this);
    }

    /** Fetch all products from the file.
     * @returns {Array} an array of products.
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

