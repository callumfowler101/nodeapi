# Node.JS API #

This repo demonstrates a Node.JS API with POST and GET requests.

## URL Variables ##
- `appointment_type`: `consultation`/`one_off`
- `appointment_medium`: `phone`/`video`
- `start_date`: a start date using the ISO8601 timecode.
-  `end_date`: an end date using the ISO8601 timecode.

## How to run locally ##
- Clone this git repo
- Run `npm run dev`
- The server will be running on `localhost:8000`
- To make a GET request follow this syntax: `http://localhost:8000/form/:appointment_type/:appointment_medium/:start_date/:end_date` -- replace any `/:` with the relavent information.
- To make a POST request create an x-www-form-urlencoded form using an API query app (ie PostMan). Query the address `http://localhost:8000/add_dates/`. The parameters for this form are: the councellor_id (labelled `id`) and the dates you wish to add (labelled `date`) using the ISO8601 timecode. The user can add multiple dates.

## GET Request ##
- The GET request can be queried via the HTML using url parameters.
- The code evaluates the parameters and returns available councellors and their times.

## POST Request ##
- The POST request makes use of x-www-form-urlencoded to allow the councellor to add multiple availability dates.
- The councellor's ID is queried as it is unique to specific coucellor. If their were two councellors with the same name then querying the id would resolve any confusion.
- The POST request returns a conformation json showing what dates have been added.

*See the code for more comments*

 