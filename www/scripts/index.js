// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    // Waits for the Device Ready Event (from cordova.js), then runs onDeviceReady
    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // All our Cordova code MUST be written in here. 

        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind( this ), false );
        document.addEventListener('resume', onResume.bind(this), false);
        document.addEventListener("backbutton", function (event) { onBackKeyDown(event);}, false);

        // Use Device Plugin to check what Platform app is running on
        var osName = device.platform;
        // Check the Version Number of device app is running on
        var osVersion = device.version;
        // Convert the String of the Version #, into a real Number
        var osVersionInt = parseInt(osVersion, 10);

        console.log("Platform is: " + osName,
            "Version # is: " + osVersion,
            "Version Integer is: " + osVersionInt);

        switch (osName.toLowerCase()) {
            case "android":
                console.log("We detected an Android Device");
                if (osVersionInt >= 4) {
                    console.log("App is fully compatible");
                } else {
                    console.log("App has some features limited");
                    // Since this Android device is below 4.0,
                    // Hide the Contact Us button (via jQ)
                    // Because we haven't created $elBtnContact Variable,
                    // We can reference the "raw" HTML node, thusly:
                    $("#btnContact").hide();
                    // Would not work at this point because we have not created the
                    // $elBtnContact Variable, to .hide() it
                    //$elBtnContact.hide();
                    
                } // If..Else regarding Version # of Anroid
                break;
            case "ios":
                console.log("We detected an iOS Device");
                if (osVersionInt >= 7) {
                    console.log("iOS App is fully compatible");
                } else {
                    console.log("iOS App has some features limited");
                    $("#btnContact").hide();
                } // If..Else regarding Version # of iOS
                break;
            case "windows":
                console.log("We detected a Windows Device");
                if (osVersionInt >= 8) {
                    console.log("Windows App is fully compatible");
                } else {
                    console.log("Windows App has some features limited");
                    $("#btnContact").hide();
                } // If..Else regarding Version # of Windows
                break;
            default:
                console.log("Unsupported OS " + osName);
                break;
        } // END swicth() checking Platform

        // After X amount of time, based on the device, hide the Splashscreen
        navigator.splashscreen.hide();
        console.log("Ready to rock!");
        
        // Plain Old JavaScript way to create an Object, based on an HTML Node.
        // var elFormSignUp = document.getElementById("formSignUp");
        // jQuery way to create an Object. The initial $ is optional.
        // # = ID
        // . = Class
        var $elFormSignUp = $("#formSignUp"),
            $elFormLogIn = $("#formLogIn"),
            $elUserEmail = $(".userEmail"),
            $elBtnLogOut = $("#btnLogOut"),
            $elBtnShare = $("#btnShare"),
            $elBtnContact = $("#btnContact"),
            $elPopErrorSignUpMismatch = $("#popErrorSignUpMismatch"),
            $elPopErrorSignUpExists = $("#popErrorSignUpExists"),
            $elPopSuccessSignUp = $("#popSuccessSignUp"),
            $elPopLogInErrorNotExists = $("#popLogInErrorNotExists"),
            $elPopLogInErrorWrongPassword = $("#popLogInErrorWrongPassword");

        // Function create/access a database when necessary
        function initDB() {
            console.log("initDB() is running");
            // Create a variable based on who is currently logged in
            var currentDB = localStorage.getItem("isLoggedIn");
            // Instantiate a new PouchDB Object (db) based who is logged in
            db = new PouchDB(currentDB);
            // Return the Object Object to the Global Scope
            return db;
        } // END initDB()

        // If..Else to check if a User has logged in or not
        if (localStorage.getItem("isLoggedIn") === "" || localStorage.getItem("isLoggedIn") === null || localStorage.getItem("isLoggedIn") === undefined) {
            console.log("No User logged in.");
        } else {
            // Confirmed someone is logged in, so initialize a Database
            initDB();
            fnShowComicsPrep();
            console.log(db);
            console.log(localStorage.getItem("isLoggedIn") + " IS logged in!");
            // Write the User's email in the Footer, after it confirms who was
            // last logged in. Otherwise Footer would still say "Home"
            $elUserEmail.html(localStorage.getItem("isLoggedIn").toLowerCase());
            $(":mobile-pagecontainer").pagecontainer("change", "#pgHome", { "transition": "flip" });
        } // END If..Else of checking if User has logged in or not

        function fnSignUp(event) {
            event.preventDefault();
            console.log("We clicked fnSignUp()");

            // Created Variables referencing Elements in HTML
            // or  $valInEmailSignUp = $("#inEmailSignUp").val();
            //     ^ Only selected the VALUE in the HTML Element, stored it.
            var $elInEmailSignUp = $("#inEmailSignUp"),
                $elInPasswordSignUp = $("#inPasswordSignUp"),
                $elInPasswordConfirmSignUp = $("#inPasswordConfirmSignUp");

            // Output only the Value of the Object, in the Console.
            console.log($elInEmailSignUp.val(), $elInPasswordSignUp.val(), $elInPasswordConfirmSignUp.val());

            // If..Else Statement to check for a True or False condition
            if ($elInPasswordSignUp.val() !== $elInPasswordConfirmSignUp.val()) {
                // This block executes if the above Condition is TRUE
                console.log("PASSWORDS DON'T MATCH!");
                // 1st. Initialize an Element (usually a Div) to behave like a Pop-up
                $elPopErrorSignUpMismatch.popup();
                // 2nd. The real Method that opens it, with Options {}
                $elPopErrorSignUpMismatch.popup("open", { "positionTo": "origin", "transition": "flip" });
                // .val() jQ Method can be used to Read a Value, and SET a Value
                $elInPasswordSignUp.val("");
                $elInPasswordConfirmSignUp.val("");
            } else {
                // Or ELSE, this block executes if the above Condition is False
                console.log("Passwords match. :)");
                var tmpValInEmailSignUp = $elInEmailSignUp.val().toUpperCase(),
                    tmpValInPasswordSignUp = $elInPasswordSignUp.val().toUpperCase();
                if (localStorage.getItem(tmpValInEmailSignUp) === null) {
                    console.log("User does not exist");
                    localStorage.setItem(tmpValInEmailSignUp, tmpValInPasswordSignUp);
                    console.log("User saved!");
                    $elPopSuccessSignUp.popup();
                    $elPopSuccessSignUp.popup("open", { "transition": "pop", "positionTo": "origin" });
                    $elFormSignUp[0].reset();
                } else {
                    console.log("User DOES exist");
                    $elPopErrorSignUpExists.popup();
                    $elPopErrorSignUpExists.popup("open", { "positionTo": "window", "transition": "flip" });
                } // END If..Else to check if User exists
            } // END If..Else to check if Passwords match
        } // END fnSignUp

        function fnLogIn(event) {
            event.preventDefault();
            console.log("START fnLogIn()");

            var $elInEmailLogIn = $("#inEmailLogIn"),
                $elInPasswordLogIn = $("#inPasswordLogIn"),
                tmpValInEmailLogIn = $elInEmailLogIn.val().toUpperCase(),
                tmpValInPasswordLogIn = $elInPasswordLogIn.val().toUpperCase();

            console.log("Email typed was: " + tmpValInEmailLogIn);
            console.log("Password typed was: " + tmpValInPasswordLogIn);

            // If..Else to check if the User exists (check LocalStorage)
            if (localStorage.getItem(tmpValInEmailLogIn) === null) {
                console.log("This user does not exist: " + tmpValInEmailLogIn);
                $elPopLogInErrorNotExists.popup();
                $elPopLogInErrorNotExists.popup("open", { "transition": "flip" });
            } else {
                console.log("This user DOES exist: " + tmpValInEmailLogIn);
                // If..Else to check if the Password matches (from LocalStorage)
                if (tmpValInPasswordLogIn === localStorage.getItem(tmpValInEmailLogIn)) {
                    console.log("Passwords match");
                    $elUserEmail.html(tmpValInEmailLogIn.toLowerCase());
                    // A way to move from screen to screen via code (jQuery Mobile)
                    $(":mobile-pagecontainer").pagecontainer("change", "#pgHome", { "transition": "flip" });
                    // Our way to confirm someone is logged in to the app,
                    // and WHO is logged in to the app (via their email)
                    localStorage.setItem("isLoggedIn", tmpValInEmailLogIn);
                    initDB(); // Either create the DB or connect to the existing
                    fnShowComicsPrep(); // Show the table of comics of the logged in user
                } else {
                    console.log("Passwords DON'T match");
                    $elPopLogInErrorWrongPassword.popup();
                    $elPopLogInErrorWrongPassword.popup("open", { "transition": "flip" });
                    $elInPasswordLogIn.val("");
                } // END If..Else Passwords match
            } // END If..Else check if User exists
        } // END fnLogIn

        function fnLogOut() {
            // Switch Conditional Statement to check known possibilities
            // Or a final Default if you didn't think of a possiblity
            // The code before the break executes and stops.
            // Pro tip: put the most probable possiblity first,
            // it saves processing power. 
            switch (confirm("Are you sure you want to log out?")) {
                case true:
                    console.log("Yes, they want to log out");
                    $elFormLogIn[0].reset();
                    $(":mobile-pagecontainer").pagecontainer("change", "#pgWelcome");
                    // When User logs out, set the localStorage 'cookie' to Null (false)
                    localStorage.setItem("isLoggedIn", "");
                    break;
                case false:
                    console.log("NO, they don't want to log out");
                    break;
                default:
                    console.log("Third possiblity?");
                    break;
            } // END Switch checking if they REALLY want to log out or not
        } // END fnLogOut()

        function fnShare() {
            // Let the User select the network THEY want to share to
            window.plugins.socialsharing.share(
                "Check out the Smith CBDB app!", // Message,
                "Download Smith CBDB today!",   // Subject optional depending on network,
                ["www/images/icon-96-xhdpi.png"],                             // Attachments in an Array,
                "http://a.co/ehhmbUS",          // URL
                function (success) { console.log("Success: " + success); },                // Success Callback,
                function (failure) { console.log("Failure: " + failure); }                 // Failure Callback (NO FINAL COMMA)
            );
        } // END fnShare()

        function fnContact() {
            window.plugins.socialsharing.shareViaEmail(
                "Regarding your app...<br>",    // Message Body (String),
                "CBDb Feedback",                // Message Subject Field (String),
                ["vcampos@sdccd.edu"],          // To: Field an Array of Strings,
                null,                           // Cc: Who else to send to? Array of Strings, or null
                null,                           // Bcc: Send to others, who don't know are being included, or null
                "www/images/icon-96-xhdpi.png", // Attachemnt from the www folder (String),
                function (success) { console.log("Succes: " + success); },  // Success callback function,
                function (failure) { console.log("FAILURE: " + failure);}   // Failure callback function   <-- No final comma
            );
        } // END fnContact()

        // ********* POUCHDB Code Start *********

        // Create/access a Database based on the Logged In User
        //var db = new PouchDB(localStorage.getItem("isLoggedIn"));

        var db; // Unitialized Database
        var $elFormSaveComic = $("#formSaveComic"); // Form Field Object
        var $elDivShowComicsTable = $("#divShowComicsTable"); // The Div placeholder to show Comics
        var $elBtnDeleteCollection = $("#btnDeleteCollection"); // Button to delete Pouch
        // Global Scope Variable to store a reference to the current comic in question
        var tmpComicToDelete;
        var $elBtnDeleteComic = $("#btnDeleteComic");
        var $elBtnEditComicPrep = $("#btnEditComicPrep");
        var $elBtnEditComicCancel = $("#btnEditComicCancel");
        var $elFormEditComicInfo = $("#formEditComicInfo");
        var $elBtnScanBarcode = $("#btnSaveBarcode");
        var $elBtnSavePhoto = $("#btnSavePhoto");

        // Function to get the first word of a Comic
        function fnGetFirstWord(str) {
            // Check if the comic supplied is a one-word title, or not
            if (str.indexOf(" ") === -1) {
                // The comic has a one-word title
                // Blob
                return str;
            } else {
                // Or else, it has a multi-word title
                // The Blob
                // With .substr() (Substring) create a copy of the string but only  the first word
                // Starts from 0th String position ("1st" letter), up to the first instance empty space
                return str.substr(0, str.indexOf(" "));
            } // END If..Else checking if only one-word title
        } // END fnGetFirstWord(str)
        // Function that reads inputs and prepares data in the right way
        function fnPrepComic() {
            // Capture input data
            var $valInTitle = $("#inTitle").val(),
                $valInNumber = $("#inNumber").val(),
                $valInYear = $("#inYear").val(),
                $valInPublisher = $("#inPublisher").val(),
                $valInNotes = $("#inNotes").val(),
                $valInBarcode = $("#inBarcode").val(),
                $valInPhoto = $("#inPhoto").val();

            // Temporary copies of the Title input; the first word & the title all Uppercase
            var tmpID1 = fnGetFirstWord($valInTitle).toUpperCase(),
                tmpID2 = $valInTitle.toUpperCase(),
                tmpID3 = "";
            // Checks existence of "A", "The", etc and removes them as unnecessary 
            switch (tmpID1) {
                case "THE":
                    console.log("Comic had 'THE' in Title");
                    // 1. Update temp Title without the word "The" & the empty space
                    tmpID3 = tmpID2.replace("THE ", "");
                    // 2. Then only keep the first three letters of the cleaned up Title
                    tmpID3 = tmpID3.substr(0, 3);
                    break;
                case "A":
                    console.log("Comic had 'A' in Title");
                    tmpID3 = tmpID2.replace("A ", "");
                    tmpID3 = tmpID3.substr(0, 3);
                    break;
                case "AN":
                    console.log("Comic had 'AN' in Title");
                    tmpID3 = tmpID2.replace("AN ", "");
                    tmpID3 = tmpID3.substr(0, 3);
                    break;
                default:
                    console.log("The comic had none of those: " + tmpID1);
                    tmpID3 = tmpID2.substr(0, 3);
                    break;
            } // END switch() checking for "A", "The", etc

            // Bundle it in JSON format (for Pouch)
            var tmpComic = {
                "_id": tmpID3 + $valInNumber + $valInYear,
                "title": $valInTitle,
                "number": $valInNumber,
                "year": $valInYear,
                "publisher": $valInPublisher,
                "notes": $valInNotes,
                "uniqueid": $valInTitle.replace(/\s/g, "").toUpperCase() + $valInNumber + $valInYear,
                "barcode": $valInBarcode,
                "photo": $valInPhoto
            };
            // Return the bundled data to Global Scope
            return tmpComic;
        } // END fnPrepComic()
        // Function that saves data to Pouch
        function fnSaveComic(event) {
            event.preventDefault();

            // The basic way how we're to save data to Pouch
            //var aComic = { "_id": "The Amazing Spider-Man", "year": "1963" };
            // The smarter way: first prep the input data, then pass it into the var
            var aComic = fnPrepComic();
            // Store the data in Pouch
            //db.put(aComic);
            console.log(aComic);
            console.log(aComic._id);
            console.log(aComic.uniqueid);

            // Finally put the data into the database
            // Deal with either the success or the failure result
            db.put(aComic, function (failure, success) {
                if (failure) {
                    console.log("Failure " + failure);
                    switch (failure.status) {
                        case 409:
                            console.log("ID already exists!");
                            // Seems the data is 'the same', so we retrieve
                            // the data existant to confirm if it's exactly the same
                            // or a subtlely-different comic
                            db.get(aComic._id, function (failure, success) {
                                if (failure) {
                                    console.log("Doesn't exist!" + failure);
                                } else {
                                    console.log("ID already exists in DB: " + success.uniqueid);
                                    console.log("ID we're trying to save: " + aComic.uniqueid);
                                    if (success.uniqueid === aComic.uniqueid) {
                                        alert("You already saved this comic!");
                                    } else {
                                        var idTmp = aComic._id,
                                            idTmpRandom = Math.round(Math.random() * 99);
                                        aComic._id = idTmp + idTmpRandom;
                                        // We store a new, unique Comic (with a new _id)
                                        db.put(aComic);
                                        fnShowComicsPrep();
                                        $("#popComicSaved").popup();
                                        $("#popComicSaved").popup("open", {"transition":"flip"});
                                    } // END If...Else comparing the existing data w/ new data
                                } // END If..Else of .get (checking if same comic)
                            }); // END .get() (checking if same comic)
                            break;
                        case 412:
                            console.log("ID empty");
                            break;
                        default:
                            console.log("Unknown error: " + failure.status);
                            break;
                    } // Switch to deal with Failure Error Codes
                } else {
                    console.log("Success " + success);
                    $elFormSaveComic[0].reset();
                    $("#popComicSaved").popup();
                    $("#popComicSaved").popup("open", { "transition": "flip" });
                    // After a comic is saved, redraw the table to show it on-screen
                    fnShowComicsPrep(); 
                } // If..Else dealing with either failure/success when .put-ing
            }); // END .put() (storing the data)
        } // END fnSaveComic(event)

        // Prepares the data we pull from the database for display on-screen
        function fnShowComicsPrep() {
            // To get one Document (record) out of Pouch:
            // db.get();
            // To get ALL the Documents out of Pouch
            // Using Options: Include all the data (not just IDs), and organize A - Z
            db.allDocs({ "include_docs": true, "ascending": true }, function (failure, success) {
                if (failure) {
                    // We got a failure object, from trying to get all the data from Pouch
                    console.log("Error retriving from db: " + failure);
                } else {
                    // Or else, no failure (yes, success object)
                    // Display from Document #3 the Title of that comic
                    // console.log("Getting data from db: " + success.rows[0].doc.title);
                    // Pass the data of all of the comics to fnShowComicsTable()
                    fnShowComicsTable(success.rows);
                } // END If..Else checking if any failures from .allDocs()
            }); // END .allDocs()
        } // END fnShowComicPrep()

        // Function to take the data passed into it, and construct a Table to show on-screen
        function fnShowComicsTable(data) {
            // Start a Variable with a Paragraph and a Table
            var str = "<p><table>";
            // Create 1st row of Headings to display basic data of a Comic
            str += "<tr><th>Title</th><th>#</th><th>Info</th></tr>";
            // FOR Loop to iterate through each Comic in the Pouch DB
            // Based on the Length (# of items) in Pouch, Loop X times
            // Create a Row of comic data X times
            for (var i = 0; i < data.length; i++) {
                /*
                    Add the data-id Attribute (based on HTML5 data- attributes)
                    which is based on the unique _id of a Comic, to the Row we created
                    Display the dynamic JavaScript alongside the static HTML
                    Add a Class to each Icon's cell, so we can target it (for a click) via jQuery
                */
                str += "<tr data-id='" + data[i].doc._id + "'><td>" + data[i].doc.title +
                       "</td><td>" + data[i].doc.number + "</td><td class='btnShowComicsInfo'>&#x1F4AC;</td></tr>";
            }
            str += "</table></p>"; // END of Table and Paragraph String (Variable)
            //  ^---NOTE THE PLUS SIGN ABOVE!!!!!!1!!!!
            // Into the Div in the HTML file, write HTML (all the data in the String [str])
            $elDivShowComicsTable.html(str);
        } // END fnShowComicsTable(data)

        // Function to delete everytihg in Pouch, and re-initialize the DB
        function fnDeleteCollection() {
            switch (confirm("You are about to delete your whole collection. \nConfirm?")) {
                case true:
                    if (confirm("Are you sure..?")) {
                        console.log("Yes, user wishes to delete the DB");
                        // Final step: DB is deleted! :(
                        db.destroy(function (failure, success) {
                            if (failure) {
                                console.log("Error in deleteing databse: " + failure);
                                alert("ERROR \nContact the developer!");
                            } else {
                                console.log("Success in deleting database: " + success);
                                initDB(); // Re-initilize the Database to start data again.
                                fnShowComicsPrep(); // Redraw the table to be empty
                            } // END Failure/Success
                        }); // END of .destroy()
                    } else {
                        console.log("User cancelled deletion");
                    } // END of If..Else asking for the SECOND delete confirmation
                    break;
                case false:
                    console.log("User cancelled deletion");
                    break;
                default:
                    console.log("Error - Contact the developer: help@trashcan.biz");
                    break;
            } // END of Switch to ask the FIRST time to confirm deletion
        } // END fnDeleteCollection()

        // Depending on which row in the Table, display the info for that comic
        function fnViewComicsInfo(thisComic) {
            console.log("fnViewComicsInfo() is running");
            console.log(thisComic);

            // Get the data-id of the row we clicked on 
            var tmpComic = thisComic.data("id");
            console.log(tmpComic); // Displays the _id of the comic in question

            // Use the tmpComic variable (based on data-id, which which references
            // ._id of my comic data) to get ONE comic from PouchDB
            db.get(tmpComic, function (failure, success) {
                if (failure) {
                    console.log("Couldn't show the comic: " + failure);
                } else {
                    console.log("Showing comic: " + success);
                    // Select the 0th Paragarph in the parent Div, write HTML there
                    $("#divViewComicsInfo p:eq(0)").html("Name: " + success.title);
                    // Select the 1st Paragraph in the paarent Div, write HTML there et al
                    $("#divViewComicsInfo p:eq(1)").html("Number: " + success.number);
                    $("#divViewComicsInfo p:eq(2)").html("Year: " + success.year);
                    $("#divViewComicsInfo p:eq(3)").html("Publisher: " + success.publisher);
                    $("#divViewComicsInfo p:eq(4)").html("Notes: " + success.notes);
                    $("#divViewComicsInfo p:eq(5)").html("Barcode: " + success.barcode);
                    // In the <img>, in the <p>, in the <div>, set the src Attribute
                    // to the Image stored in Pouch 
                     $("#divViewComicsInfo p:eq(6) img").attr("src", success.photo);

                    // Via jQuery Mobile, then display screen - OLD VERSION (Deprecated)
                    //$.mobile.changePage("#popViewComicsInfo", {"role": "dialog"});
                    // Newer version of the Page Transition jQM code
                    $(":mobile-pagecontainer").pagecontainer("change", "#popViewComicsInfo", { "role": "dialog" });
                } // END If...Else trying to get the comic in question and display on-screen
            }); // END .get()

            // Set the temporary comic Variable to the comic we've currently clicked on
            // So we know which one to delete/edit/etc
            tmpComicToDelete = tmpComic;
        } // END fnViewComicsInfo()

        function fnDeleteComic() {
            console.log("Starting to delete comic " + tmpComicToDelete);
            // To delete one comic, let's first check if it exists in Pouch
            db.get(tmpComicToDelete, function (failure, success) {
                if (failure) {
                    console.log("ERROR. Comic does not exist: " + failure);
                } else {
                    switch (confirm("About to delete this comic. \nAre you sure?")) {
                        case true:
                            db.remove(success, function (failure, success) {
                                if (failure) {
                                    console.log("Error in deletion: " + failure);
                                } else {
                                    console.log("Success in deletion:" + success);
                                    // After removing data, redraw the table
                                    fnShowComicsPrep();
                                    $("#popViewComicsInfo").dialog("close");
                                } // END If..Else to actually delete the data
                            }); // END .remove()
                            break;
                        case false:
                            console.log("User cancelled.");
                            break;
                        default:
                            console.log("Third error? To fix...");
                            break;
                    } // END Switch to confirm deletion
                } // END If..Else to try to delete a comic
            }); // END .get()
        } // END fnDeleteComic()

        function fnEditComicPrep() {
            console.log("Start of fnEditComicPrep() " + tmpComicToDelete);

            db.get(tmpComicToDelete, function (failure, success) {
                if (failure) {
                    console.log("Error getting comic: " + failure);
                } else {
                    $("#inTitleEdit").val(success.title);
                    $("#inNumberEdit").val(success.number);
                    $("#inYearEdit").val(success.year);
                    $("#inPublisherEdit").val(success.publisher);
                    $("#inNotesEdit").val(success.notes);
                    $("#inBarcodeEdit").val(success.barcode);
                } // END If..Else checking for comic and populating fields
            }); // END .get() to check if comic in question exists
            $(":mobile-pagecontainer").pagecontainer("change", "#popEditComicInfo", { "role": "dialog" });
        } // END fnEditComicPrep()

        function fnEditComicCancel() {
            $("#popEditComicInfo").dialog("close");
        } // END fneditComicCancel()

        function fnFormEditComicInfo(event) {
            event.preventDefault();
            console.log("Start fnFormEditComicInfo() " + tmpComicToDelete);

            var $valInTitleEdit     = $("#inTitleEdit").val(),
                $valInNumberEdit    = $("#inNumberEdit").val(),
                $valInYearEdit      = $("#inYearEdit").val(),
                $valInPublisherEdit = $("#inPublisherEdit").val(),
                $valInNotesEdit     = $("#inNotesEdit").val(),
                $valInBarcodeEdit = $("#inBarcodeEdit").val();

            console.log("Old data: ",
                $valInTitleEdit, $valInNumberEdit, $valInYearEdit,
                $valInPublisherEdit, $valInNotesEdit, $valInBarcodeEdit);

            db.get(tmpComicToDelete, function (failure, success) {
                if (failure) {
                    console.log("Error in getting the comic: " + failure);
                } else {
                    // After confirming the comic in question exists,
                    // re-insert into the database with new (or same) data,
                    // plus a REVISION. - Make sure to use success._rev
                    db.put({
                        "_id": success._id,
                        "title": $valInTitleEdit,
                        "number": $valInNumberEdit,
                        "year": $valInYearEdit,
                        "publisher": $valInPublisherEdit,
                        "notes": $valInNotesEdit,
                        "barcode": $valInBarcodeEdit,
                        "_rev": success._rev
                    }, function (failure, success) {
                        if (failure) {
                            console.log("Error updating the comic: " + failure);
                        } else {
                            console.log("Success updating the comic: " + success);
                            // After successful data update, repopulate the paragraphs on-screen
                            $("#divViewComicsInfo p:eq(0)").html("Name: " + $valInTitleEdit);
                            $("#divViewComicsInfo p:eq(1)").html("Number: " + $valInNumberEdit);
                            $("#divViewComicsInfo p:eq(2)").html("Year: " + $valInYearEdit);
                            $("#divViewComicsInfo p:eq(3)").html("Publisher: " + $valInPublisherEdit);
                            $("#divViewComicsInfo p:eq(4)").html("Notes: " + $valInNotesEdit);
                            $("#divViewComicsInfo p:eq(5)").html("Barcode: " + $valInBarcodeEdit);
                            // Close the current dialog box (the Edit screen)
                            $("#popEditComicInfo").dialog("close");
                            // Redraw the table
                            fnShowComicsPrep();
                        } // END If..Else .put() new data
                    }); // END .put() the new version of the data
                } // END If..Else of .get()
            }); // END .get to check comic exists
        } // END fnFormEditComicInfo(event)

        // 3rd Party Barcode Scanner for Cordova/PhoneGap
        // https://github.com/phonegap/phonegap-plugin-barcodescanner
        function fnScanBarcode() {
            console.log("fnScanBarcode() is running");

            // Syntax: Success callback function, failure callback, options
            cordova.plugins.barcodeScanner.scan(
                function (success) {
                    $("#inBarcode").val(success.text);
                    console.log("Type of barcode: " + success.format);
                },
                function (failure) {
                    alert("Scanning failed: " + failure);
                },
                {
                    "prompt": "Place comic's barcode in the scan area",
                    "resultDisplayDuration": 1000,
                    "orientation": "landscape",
                    "disableSuccessBeep": false
                }
            ); // END .scan()
        } // END fnScanBarcode()

        function fnSavePhoto() {
            console.log("fnSavePhoto() is running");

            // Attempt to take a photo, deal with success/failure,
            // And pass in Options
            navigator.camera.getPicture(fnCameraSuccess, fnCameraFailure, {
                "quality": 25,
                "saveToPhotoAlbum": true,
                "targetWidth": 1024,
                "targetHeight": 768
            });

            function fnCameraSuccess(success) {
                console.log("Camera success: " + success);
                // If success, write the path to the photo, into the Photo input field
                $("#inPhoto").val(success);
            } // END fnCameraSuccess()

            function fnCameraFailure(failure) {
                console.log("Camera failure: " + failure);
            } // END fnCameraFailure()
        } // END fnSavePhoto()



        // Event Listener for Submitting the Save Comic Form (capturing event)
        $elFormSaveComic.submit(function (event) { fnSaveComic(event);});
        // ********* POUCHDB Code END *********

        // Plain JS Event Listener, to wait for a Submit, then run a Function:
        // elFormSignUp.addEventListener("submit", function(event){fnSignUp(event)});
        // jQuery way to use an Event Listener (and then run a Function):
        // After Submit, capture the default Event (refresh),
        // pass it into the Named Funciton fnSignUp, to prevent default behavior
        $elFormSignUp.submit(function (event) { fnSignUp(event);});
        $elFormLogIn.submit(function (event) { fnLogIn(event);});
        // Simpler syntax when pressing a plain old button:
        $elBtnLogOut.on("click", fnLogOut);
        $elBtnShare.on("click", fnShare);
        $elBtnContact.on("click", fnContact);
        $elBtnDeleteCollection.on("click", fnDeleteCollection);
        // Event Listener to handle when a speech bubble is clicked in the table
        // var $thing = $("#htmlthing"); <-- Referencing an ID
        // var $anotherthing = $(".htmlthing"); <-- Referencing a (many) classe(s)
        // When we click on the Element with Class .btnShowComicInfo,
        // in the Element $elDivShowComicsTable, invoke the Function fnViewComicsInfo
        // Into fnViewComicsInfo, pass the Parameter: the Parent (<tr>) of the
        // particular speech bubble we clicked on -->  $(this).parent()
        $elDivShowComicsTable.on("click", ".btnShowComicsInfo",
            function () { fnViewComicsInfo($(this).parent()); });
        $elBtnDeleteComic.on("click", fnDeleteComic);
        $elBtnEditComicPrep.on("click", fnEditComicPrep);
        $elBtnEditComicCancel.on("click", fnEditComicCancel);
        $elFormEditComicInfo.submit(function (event) { fnFormEditComicInfo(event); });
        $elBtnScanBarcode.on("click", fnScanBarcode);
        $elBtnSavePhoto.on("click", fnSavePhoto);
    } // END onDeviceReady()

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    }

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    }

    function onBackKeyDown(event) {
        console.log("Prevented Back Button: " + event);
        event.preventDefault();
    } // END onBackKeyDown(event)
})();

/*
    Name:       Victor Campos <vcampos@sdccd.edu>
    Date:       2017-11-28
    Project:    CBDb
    Version:    1.0
    Description:A comic book database app. 
*/