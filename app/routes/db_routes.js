
module.exports = function(app, db){
    app.get('/form', (req, res)=>{

        let sd = new Date(req.body.start_date);
        let ed = new Date (req.body.end_date);

        let dsd = sd.getDate()+sd.getMonth()+sd.getFullYear();
        let ded = ed.getDate()+ed.getMonth()+ed.getFullYear();

        let data = {
            "appointment_type": req.body.appointment_type,
            "appointment_medium": req.body.appointment_medium,
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
            let councellor = {}

            if(i.appointment_types.includes(data.appointment_type)){
                if(i.appointment_mediums.includes(data.appointment_medium)){
                    councellor.first_name = i.first_name;
                    councellor.last_name = i.last_name;
                    councellor.dates_available = [];

                    i.availability.forEach(j => {
                        let d = new Date(j.datetime);
                        if(dateCheck(d)) councellor.dates_available.push(d);
                    }); 

                    if(councellor.dates_available.length>0) availableCouncellors.push(councellor);
                }
            }     
        });

        console.log(availableCouncellors);
        res.send(availableCouncellors);
    
    });

    app.post('/database', (req, res)=>{
        // post for councellor to add avaliability
    });
};

