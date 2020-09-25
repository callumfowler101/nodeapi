 const fs = require('fs');
 const cryptoRandomString = require('crypto-random-string')

module.exports = function(app, db){
    app.get('/form/:type/:medium/:start_date/:end_date', (req, res)=>{

        let reqData = req.params;

        let sd = new Date(reqData.start_date);
        let ed = new Date (reqData.end_date);

        let dsd = sd.getDate()+sd.getMonth()+sd.getFullYear();
        let ded = ed.getDate()+ed.getMonth()+ed.getFullYear();

        let data = {
            "appointment_type": reqData.type,
            "appointment_medium": reqData.medium,
            "start_date": dsd,
            "end_date": ded
        };

        function dateCheck(date){
            let ld = new Date(date);
            let ald = ld.getDate()+ld.getMonth()+ld.getFullYear();
            if(data.start_date<=ald&&ald<=data.end_date) return true;
        }

        let availableCouncellors = [];

        db.forEach(i => {
            let councellor = {};

            if(i.appointment_types.includes(data.appointment_type)){
                if(i.appointment_mediums.includes(data.appointment_medium)){
                    councellor.first_name = i.first_name;
                    councellor.last_name = i.last_name;
                    councellor.appointment_type = i.appointment_types;
                    councellor.appointment_medium = i.appointment_mediums;
                    councellor.dates_available = [];
                    i.availability.forEach(j => {
                        let d = new Date(j.datetime);
                        if(dateCheck(d)) councellor.dates_available.push(d);
                    }); 
                    if(councellor.dates_available.length>0) availableCouncellors.push(councellor);
                }
            }     
        });
        res.send(availableCouncellors);    
    });

    app.post('/add_dates/:id/:number/:dates()', (req, res)=>{
        let reqData = req.params;
        let _id = reqData.id;
        let numOfDates = reqData.number;

        let councellor = {}

        db.forEach(i => {
            if(_id === i.counsellor_id){
                councellor.first_name = i.first_name;
                councellor.last_name = i.last_name;
                councellor.dates_added = [];
                numOfDates.forEach(j => {
                    let time = {
                        "id": `${cryptoRandomString({length: 22})}`,
                        "datetime": j
                    };
                    i.availability.push(time);
                    councellor.dates_added.push(j);
                });
            }
        });

        let _db = JSON.stringify(db, null, 2);
        fs.writeFile("./data.json", _db, ()=>{
            console.log("database updated");
        });
        res.send(councellor);
    });
};

