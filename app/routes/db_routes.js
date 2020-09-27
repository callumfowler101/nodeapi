 // local node modules are established.
 const fs = require('fs');
 const cryptoRandomString = require('crypto-random-string')

module.exports = function(app, db){
    // the app responds to GET and POST requests on port 8000.

    app.get('/form/:type/:medium/:start_date/:end_date', (req, res)=>{

        let reqData = req.params; // parameters are taken from url.

        // Date objects are created to parse the ISO8601 time code.
        // It will get converted into milliseconds (since Unix Epoch)
        // to correctly check if an available date falls within the 
        // query.
        let startDate = new Date(reqData.start_date);
        let endDate = new Date(reqData.end_date);

        // the data object is created to contain all the relevant data from 
        // the query.
        let data = {
            "appointment_type": reqData.type,
            "appointment_medium": reqData.medium,
            "start_date": startDate.getTime(),
            "end_date": endDate.getTime()
        };

        // dateCheck() checks if a given date falls between the two 
        // dates queried.
        function dateCheck(date){
            let localDate = new Date(date);
            let dateToCheck = localDate.getTime();
            if(data.start_date<=dateToCheck&&dateToCheck<=data.end_date) return true; 
        }

        // this array will eventually contain all of the possible
        // counsellors that match the query 
        let availableCounsellors = [];

        db.forEach(i => {
            let counsellor = {}; 

            if(i.appointment_types.includes(data.appointment_type)){
                if(i.appointment_mediums.includes(data.appointment_medium)){
                    counsellor.first_name = i.first_name;
                    counsellor.last_name = i.last_name;
                    counsellor.appointment_type = i.appointment_types;
                    counsellor.appointment_medium = i.appointment_mediums;
                    counsellor.dates_available = [];
                    i.availability.forEach(j => {
                        let d = new Date(j.datetime);
                        if(dateCheck(d)) counsellor.dates_available.push(d);
                    }); 
                    if(counsellor.dates_available.length>0) availableCounsellors.push(counsellor);
                }
            }     
        });
        // the list of avaliable counsellors is sent back as a reponse
        // to the query.
        if(availableCounsellors.length>0){
            res.send(availableCounsellors); 
        } else {
            let msg = "No counsellors found. Please check the information and try again."
            res.send(msg);
        }
           
    });

    // the POST request's body is queried to generate the response.
    app.post('/add_dates', (req, res)=>{
        let _id = req.body.id; 
        let dates = req.body.date; // if there are multiple items with the "date" key the values are placed into an array.

        let counsellor = {}
        
        db.forEach(i => {
            if(_id === i.counsellor_id){
                counsellor.first_name = i.first_name;
                counsellor.last_name = i.last_name;
                counsellor.dates_added = [];
                if(Array.isArray(dates)){ // dates is queried if it is an array or not
                    dates.forEach(j => {
                        // the time object is structured to match other entries in the data base.
                        let time = {
                            "id": `${cryptoRandomString({length: 22})}`, // cryptoRandomString is used to generate a unique id for this session.
                            "datetime": j // the user can input any data which matches the ISO8601 timecode.
                        };
                        i.availability.push(time);
                        counsellor.dates_added.push(j);
                    });
                } else {
                    let time = {
                        "id": `${cryptoRandomString({length: 22})}`, 
                        "datetime": dates 
                    };
                    i.availability.push(time);
                    counsellor.dates_added.push(dates);
                }
            }
        });
        // the database is reformatted before being rewritten with the new data.
        let _db = JSON.stringify(db, null, 2); 
        fs.writeFile("./data.json", _db, ()=>{
            console.log("database updated");
            // the details of the change are sent as a response.
            // it returns the counsellors name and the dates they added.
            res.send(counsellor);
        });
    });
};

