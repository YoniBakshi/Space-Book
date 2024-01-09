

README :
- This project involves building a web application with both server-side and client-side components using Node.js, Express, EJS, JavaScript, HTML, CSS, and a database. 
- In this Express project we've created a social website using NASA's media.
- Interacting with NASA's data by using REST API, using DataBase to save Users and another DataBase to save all Comments.
- DataBase User columns :
  - email, firstName, lastName, password (CODED bcrypt)
- DataBase Comment columns :
  - userId (used for Relation), comment, imgId, status (boolean if comment was deleted)
- Using relation between User and Comment DataBases.
- page "/" will be login page or home page (feed NASA's daily pictures) (Using middleware)
- User can registration has 2 parts - each field must be between 3-32 letters : 
  - Part 1 fields :
    - Valid email.
    - First name (A-Z, a-z only)
    - Last name (A-Z, a-z only)
  - Part 2 fields : password and confirm password.
Notice : 
- ONLY when finish registration successfully data will be saved on DataBase of User .
- Data of part 1 is saved on a cookie for 30 seconds, so during those 30 seconds user can go back from part 2 to part 1 and data will be saved.
- Submission of part 1 will check validation of each field AND Email field will be compared to exsiting users in DataBase User, 
- Email will be checked again if validate after part 2. (maybe other user was faster is registration of 30 seconds cookie).
- Valid Login will check the input if Email and Password - if user not found in DataBase or unmatching - same error message will appear (for security reasons).
- After login successfully, a feed page of NASA's daily picture will be loaded (default up to date) plus - it's previous 2 days.
  - Each media is styled by a card and detailed :
    - Media = Image/Video
    - Title
    - Date
    - Explanation
    - Copyrights
  - plus, each media has a "Comments" button attached which opens a Modal with the picture in a bigger view, explanation and comments.
- User can pick a date and it will be loaded on feed page by the results of NASA's data.
- By clicking on "Comments" button, a modal will be open with this specific media, title, date, explanation and comments.
- Comments :
  - Comments area is located to the right of Modal. (Loading spinner)
  - Published comments (if exists) will be shown with it's writer's username.
  - Option to submit a comment by press "Enter".
  - Comment must be between 1-128 letters.
  - Only the writer of the comment has the option to delete his comment.
- notice :
- Polling every 15 seconds.
- Writer's comment see the publication and deletion immediately, while every other user which isn't the writer of this specific comment - will see those changes with the polling.


Notes :
- Default feed date is up to date.
- Date input can be change by click and pick in the calendar or use keyboard.
- Using infinite scrolling, each loading is a serie of 3 more pictures. (spinner is shown)
- Read more/less button in explanations.


Required installs :
npm install sqlite3
npm install sequelize
npm install connect-session-sequelize
node_modules/.bin/sequelize db:migrate
npm install express-session
npm install bcrypt
npm install
npm install scroll

Contributors :
Yehonatan Bakshi

Hila Saadon 
