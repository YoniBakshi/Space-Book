"use strict";

(function () {
    const APIURL = 'https://api.nasa.gov/planetary/apod';
    const APIKEY = '4Y3Sd7QzaQF3QK1eomVPaMgysACy1D2FKIgFfyeh';

    document.addEventListener("DOMContentLoaded", function () {
        // At first, default date is set up to date - display NASA's daily media of last 3 days.
        date.initDate()
        getDataFromNASA()

        //get a picked date
        document.getElementById("currentDate").addEventListener("change", (event) => {
            //clear image card
            document.getElementById("imgCard").innerHTML = "";
            let currDate = new Date(event.target["value"])
            date.updateDate(currDate)
        })

        // Validate written comment (between 1 - 128 characters), if valid - add it to comment's array.
        document.getElementById("commentPost").addEventListener("keypress", (elm) => {
            if (elm.key === 'Enter' && validatorInput(elm)) {
                postData(elm)
                document.getElementById("user-input").value = "";
            }
        });
        // Update comments
        document.getElementById('imgModal').addEventListener("keypress", (elm) => {
            if (elm.key === 'Enter')
                getDataPostedComments(elm)
        });
        // Infinite scroll - loading 3 pictures every time
        document.addEventListener("scroll", () => {
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1) {
                let currDate = new Date(date.getNewDate().start)
                currDate.setDate(currDate.getDate() - 1);
                date.updateDate(currDate)
            }
        })
    });

    /**
     *  Date's Module.
     */
    const date = function () {
        /**
         * Display date input field.
         * Initialize the current date and it's 2 prior days.
         * Sets the value of 'pickedDate' & 'clickedImg' to the current date.
         * @param pickedDate = will contain the chosen date of the user and will appear first at the feed.
         * @param prior2dates = according to 'pickedDate', contain the end date which is the date of 2 previous days
         */
        let pickedDate, prior2Dates, clickedImg;

        function initDate() {
            pickedDate = new Date()
            prior2Dates = new Date()
            document.getElementById('currentDate').valueAsDate = pickedDate
            prior2Dates.setDate(prior2Dates.getDate() - 2);
            pickedDate = `${pickedDate.getFullYear()}-${pickedDate.getMonth() + 1}-${pickedDate.getDate()}`
            prior2Dates = `${prior2Dates.getFullYear()}-${prior2Dates.getMonth() + 1}-${prior2Dates.getDate()}`
            clickedImg = pickedDate
        }

        /**
         * Module parameters.
         * NOTE : to match the requested format of timeline - we'll switch the meanings : (returns these values : )
         * 'pickedDate' named as 'end' date (since it's the latest date) and in relation to it,
         * 'prior2Dates' named as 'start' date (since it's the furthest date)
         */
        function getNewDate() {
            return {
                "start": prior2Dates,
                "end": pickedDate,
                "date": clickedImg
            }
        }

        /**
         * Set clicked image according to received ID.
         * @param date = same as the ID of picture so we use it to recognize the clicked image (through "Comments" button)
         */
        function setCommentDate(date) {
            clickedImg = date
        }

        /**
         * Update values of the 2 variables which saves the dates of 3 days range.
         * @param curr = current date, set according to it (Needs to calculate the range to save 2 previous days.)
         */
        function updateDate(curr) {
            pickedDate = `${curr.getFullYear()}-${curr.getMonth() + 1}-${curr.getDate()}`
            curr.setDate(curr.getDate() - 2);
            prior2Dates = `${curr.getFullYear()}-${curr.getMonth() + 1}-${curr.getDate()}`
            getDataFromNASA()
        }

        /**
         * Module functions
         */
        return {
            initDate: initDate,
            updateDate: updateDate,
            getNewDate: getNewDate,
            commentDate: setCommentDate
        }
    }();

    /**
     *
     * GET request - send to NASA to get the data of requested dates.
     * Error message = same as NASA's
     */
    function getDataFromNASA() {
        // Validation: Make sure date is correct
        console.log(date.getNewDate().start)
        if (!isValidDate(date.getNewDate().end) || !isValidDate(date.getNewDate().start))
            document.getElementById("main-container").innerHTML = `<h1 class="text-bg-light">Error: Date is not defined</h1>`;

        fetch(`${APIURL}?api_key=${APIKEY}&start_date=${date.getNewDate().start}&end_date=${date.getNewDate().end}`)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                if (data.code === 400)
                    throw new Error(`code: ${data.code} Msg: ${data.msg}`)
                create3ImgSerie(data)
            })
            .catch(function (error) {                       // NASA's error message
                console.log("1")
                document.getElementById("main-container").innerHTML = `<h1 class="text-bg-light">${error}</h1>`
            });
    }

    /**
     * POST REQUEST
     * Create post method and send data of written comment to server
     * @param event = Submit comment
     */
    function postData(event) {
        event.preventDefault();
        // Validation: Make sure the event target has a value property
        if (!event.target.value)
            document.getElementById("main-container").innerHTML = `<h1 class="text-bg-light">Error: comment is not defined</h1>`;
        console.log(event.target.value)
        fetch("/home/resources", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                "userName": document.getElementById("userName").getAttribute("name"),
                "currComment": event.target.value,
                "id": date.getNewDate().date
            })
        }).then(function (response) {
            // If the response is not in the 200 range, it's an error
            if (!response.ok)
                throw new Error(response.statusText);

            return response.json();
        }).catch(function (error) {
            console.log("2")
            document.getElementById("main-container").innerHTML = `<h1 class="text-bg-light">${error}</h1>`;
        });
    }

    /**
     * Get data of published comments - according to ID media (= the ID is the date)
     */
    function getDataPostedComments() {
        // Validation: Make sure the date object is defined and has a .date property
        if (!date.getNewDate().date || !isValidDate(date.getNewDate().date))
            document.getElementById("main-container").innerHTML = `<h1 class="text-bg-light">Error: date object is not defined or does not have a .date property</h1>`;

        fetch(`/home/resources/${date.getNewDate().date}`)
            .then(function (response) {
                if (response.status === 200)
                    return response.json();
                else
                    throw new Error(`code: ${response.code} Msg: ${response.msg}`);
            }).then(function (data) {
            document.getElementById("comments-data").innerHTML = addCommentsToModal(data);
            document.querySelectorAll('.to-del').forEach((elem) => {
                elem.addEventListener("click", delPost);
            });
        }).catch(function (error) {
            console.log("3")

            document.getElementById("main-container").innerHTML = `<h1>${error}</h1>`;
        });
    }
    /**
     * Delete wanted comment, only the writer has the option to delete his own comment
     * The delete operation will display immediately to the writer
     * @param event = delete button clicked
     */
    function delPost(event) {
        event.preventDefault();
        clearInterval(intrevalId);              // Initialize 'intrevalId' timer
        getDataPostedComments()
        intrevalId = setInterval(getDataPostedComments, 15000);
        const deleteItem = event.target.id.replace("del-", "");
        // Validation: Make sure deleteItem is a non-empty string
        if (!deleteItem || typeof deleteItem !== 'string') {
            document.getElementById("main-container").innerHTML = `<h1 class="text-bg-light">Error: deleteItem must be a non-empty string</h1>`;
            return;
        }
        fetch(`/home/del/${deleteItem}`, {method: 'DELETE'})
            .then(function (response) {
                return response.json();
            }).then(function (data) {
            if (data.status >= 400)
                throw new Error(`Msg: ${data.msg}`);
        })
            .catch(function (error) {
                document.getElementById("main-container").innerHTML = `<h1 class="text-bg-light">${error}</h1>`;
            });
    }
    /**
     * Open Modal of clicked media's button - display media :
     * explanation, date, published comments & option to add comment
     * @param data = received data (from NASA) of clicked media's button
     */
    const openModal = (data) => {
        date.commentDate(data.date);
        let mediaElem = getMediaType(data, "");
        document.getElementById("inputSizeError").classList.add('d-none');
        document.getElementById("media-type").innerHTML = mediaElem;
        document.getElementById("imgModalLabel").innerHTML = data.title;
        document.getElementById("modal-date").innerHTML = fixDate(data.date);
        document.getElementById("data-section").innerHTML = data['explanation'];
    }

    /**
     * Create 3 card images in each loading.
     * Using loop, send the received data of NASA and attach the relevant details together for each card and sum it as html string.
     * @param data received from data according to the requested dates which are entered (default start date is set for today and it loads also previous 2 days.)
     */
    const create3ImgSerie = (data) => {
        data.reverse().forEach((item) => {
            document.getElementById("imgCard").innerHTML += createHtmlImgInfo(item);
        });
        // AddEventListener to each "Comments" button. (= in every card image)
        document.querySelectorAll(".comments").forEach((item) => {
            item.addEventListener("click", getDataImgModal)
        })
        readMoreLessBtn()       // If needed (in condition to it's length) - AddEventListener to "Read more/less" explanation field.
    }

    /**
     * Loop to get data of 3 media according to picked date and 2 previous days.
     * startExpla = First part of explanation for button Read more/less.
     * endExpla =  Last part of explanation for button Read more/less.
     * mediaElem = Get type of clicked media.
     * @param currData = data of current date which it loads at the moment.
     * @returns {string} string HTML modify card images according to received.
     */
    const createHtmlImgInfo = (currData) => {

        let startExpla, endExpla, moreBtn, mediaElem, cardImg;
        if (currData['explanation'].length > 100) {
            startExpla = currData['explanation'].split(' ').slice(0, 40).join(' ')
            endExpla = currData['explanation'].split(' ').slice(40,).join(' ')
            moreBtn = `${startExpla}<a class="btn btn-link readMore" id="b${currData.date}m">...Read more</a>
                               <span class="d-none" id="b${currData.date}e"> ${endExpla}</span>
                               <a class="btn btn-link readLess d-none" id="b${currData.date}l">Read less</a>`
        } else
            moreBtn = `${currData['explanation']}`
        console.log("im here")

        mediaElem = getMediaType(currData, "max-height: 300px; min-height: 300px;")
        //cop = copyrights
        let cop = 'Unknown'
        if (currData['copyright'])
            cop = currData['copyright'];

        cardImg = createHtmlCard(currData, moreBtn, mediaElem, cop)
        return cardImg;
    }
    /**
     * Create card of media, modify it and return the element HTML string.
     * @param currData = data of specific day
     * @param moreBtn = Read More or Read Less button
     * @param mediaElem = media's type
     * @param cop = copyrights
     * @returns html string
     */
    const createHtmlCard = (currData, moreBtn, mediaElem, cop) => {
        return `<div class="card mb-3" >
                <div class="row g-0 ">
                    <div class="col-12 col-md-3">${mediaElem}</div>
                        <div class="col-12 col-md-9">
                            <div class="card-body" >
                                <h5 class="card-title text-dark"><b>Title : </b> ${currData.title}</h5>
                                <p><h5 class="card-title text-dark"><b>Date : </b> ${fixDate(currData.date)}</h5></p>
                                <p><h5 class="card-text text-dark"><b>Explanation : </b>
                                ${moreBtn}</h5></p>
                                <p><h5 class="card-title text-dark"><b>Copyright : </b> ${cop}</h5></p>
                                <button type="button" id=${currData.date} class="btn btn-primary comments" data-bs-toggle="modal" 
                                data-bs-target="#imgModal">Comments</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
    }

    /**
     * Function for Read more & Read less according to signs
     */
    const readMoreLessBtn = () => {
        document.querySelectorAll(".readMore").forEach((item) => {
            item.addEventListener("click", (elm) => {
                setReadBtn(elm.target["id"], 'm', 'l', 'e')
            })
        })

        document.querySelectorAll(".readLess").forEach((item) => {
            item.addEventListener("click", (elm) => {
                setReadBtn(elm.target["id"], 'l', 'm', 'e')
            })
        })
    }

    // @param 'intrevalId' = uses to announce the timer every 15 seconds
    let intrevalId = 0;
    /**
     * REST API
     * Get data from NASA about clicked image
     * @param elem = Media's "Comments" button which was clicked
     */
    const getDataImgModal = (elem) => {
        document.getElementById("comments-data").innerHTML = '';

        // Validation: Make sure date is correct
        if (!elem.target || !isValidDate(elem.target.id))
            document.getElementById("main-container").innerHTML = `<h1 class="text-bg-light">Error: Date is not defined</h1>`;

        fetch(`${APIURL}?api_key=${APIKEY}&date=${elem.target.id}`)
            .then(function (response) {
                // If the response is not in the 200 range, it's an error
                if (!response.ok)
                    throw new Error(response.statusText);
                return response.json();
            })
            .then(function (data) {
                openModal(data);
                getDataPostedComments();           // Get Published comments of specific clicked media
                if (intrevalId)                    // Timer of 15 seconds, clear and start over when reach to 15 seconds
                    clearInterval(intrevalId);     // Initialize timer
                intrevalId = setInterval(getDataPostedComments, 15000);  // Refresh comments every 15 seconds
            })
            .catch(function (error) {              //
                console.log("4")

                document.getElementById("main-container").innerHTML = `<h1 class="text-bg-light">${error}</h1>`;
            });
    };


    /**
     * Modify the submitted comment and add it
     * @param data = Data of submitted comment
     * @returns {string} string HTML of submitted comment
     */
    const addCommentsToModal = (data) => {
        console.log(document.getElementById("userId").getAttribute("value"))
        let commentInfo = ``;
        data.forEach(function (item) {
            let delLink = item.userId === document.getElementById("userId").getAttribute("value") ?
                ` <a class="btn btn-link mr-2 to-del" href="del/${item.userId}" id="del-${item.userId}">delete</a>` : ``
            commentInfo +=
                `<div class="card mb-4">
                        <div class="card-body">
                            <p class="text-black">${item.comment}</p>
                            <div class="d-flex justify-content-between">
                                <div class="d-flex flex-row align-items-center">
                                    <p class="small mb-0 ms-2 fw-bold">${document.getElementById("userName").getAttribute("value")}</p>
                                </div>
                                <div class="d-flex flex-row align-items-center">
                                    <p class="small text-muted mb-0">${delLink}</p>
                                </div></div></div></div>`;
        });
        return commentInfo;
    }
    /**
     * Toggle element
     * @param elmId = id of element to toggle
     */
    const creatToggle = (elmId) => {
        document.getElementById(elmId).classList.toggle("d-none")
    }
    /**
     * Validate date
     * @param dateString = date to check if valid
     * @returns {boolean} = true if date is valid, false if date isn't valid
     */
    function isValidDate(dateString) {
        const date = new Date(dateString);
        return !isNaN(date.valueOf());
    }
    /**
     * Get type of specific media - if it's an image or an iframe video
     * @param currData = data of specific day
     * @param currStyle = modified
     * @returns {string} = image or iframe
     */
    const getMediaType = (currData, currStyle) => {
        return (currData['media_type'] === 'image') ?
            `<img src=${currData.url} class="card-img-top " style="${currStyle}" alt="#">` :
            `<iframe src=${currData.url} class="card-img-top " style="${currStyle}"></iframe>`;
    }

    /**
     * Format date to mm/dd/yyyy
     * @param date = date
     * @returns {`${*}-${*}-${*}`}  = format of mm/dd/yyyy
     */
    const fixDate = (date) => {
        let dateComponents = (date).split("-");
        return `${dateComponents[1]}-${dateComponents[2]}-${dateComponents[0]}`;
    }

    /**
     * Modular function to toggle when needed
     * @param id = Read More or Read Less
     * @param c1 = to change
     * @param c2 = change to
     * @param c3 = change to
     */
    const setReadBtn = (id, c1, c2, c3) => {
        creatToggle(`${id}`)
        creatToggle(`${id.replace(c1, c2)}`)
        creatToggle(`${id.replace(c1, c3)}`)
    }
    /**
     * Validate comment input - length must be between 1-128.
     * @param input
     * @returns {boolean}
     */
    const validatorInput = (input) => {
        input.preventDefault();
        if (!(input.target.value.trim().length > 0 && input.target.value.trim().length < 128)) {
            document.getElementById("inputSizeError").classList.remove('d-none');
            return false;
        }
        document.getElementById("inputSizeError").classList.add('d-none');
        return true;
    }

})()