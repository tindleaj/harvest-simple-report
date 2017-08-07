const axios = require("axios");
const fs = require("fs");
// rename auth-example.js to auth.js and add your Harvest API key
const auth = require("./auth");

const BASE = "http://austintindle.harvestapp.com/";
var generalID = "13718240"; // Seal redesign: 13871903; General: 13718240;
var sealID = "13871903"; // Seal redesign: 13871903; General: 13718240;
var start = "20170728";
var end = "20170810";
var url1 = "/projects/" + generalID + "/entries?from=" + start + "&to=" + end;
var url2 = "/projects/" + sealID + "/entries?from=" + start + "&to=" + end;

function printReport(url) {
  axios
    .get(url, {
      baseURL: BASE,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: auth.key
      }
    })
    .then(res => {
      res.data.forEach(entry => {
        var spent_at = entry.day_entry.spent_at;
        var hours = entry.day_entry.hours;

        getTaskByID(entry.day_entry.task_id).then(res => {
          console.log(
            `${spent_at}: [hrs: ${hours}] [${res.task.name}] - ${entry.day_entry
              .notes}`
          );
        });
      });
    });
}

function getTaskByID(id) {
  return new Promise((resolve, reject) => {
    axios
      .get("tasks/" + id, {
        baseURL: BASE,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization:
            "Basic dGluZGxlYWpAZ21haWwuY29tOkZzazUtIXcvUDRNaypGPW4zQQ=="
        }
      })
      .then(res => {
        resolve(res.data);
      });
  });
}

function getTaskByName(name) {
  // Get all tasks
  getAllTasks().then(res => {
    res.forEach(entry => {
      // if task name is the parameter passed
      if (entry.task.name === name) {
        var id = entry.task.id;
        getTaskByID(id).then(res => {
          console.log(res);
        });
      }
    });
  });
}

function getAllTasks() {
  return new Promise((resolve, reject) => {
    axios
      .get("tasks/", {
        baseURL: BASE,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization:
            "Basic dGluZGxlYWpAZ21haWwuY29tOkZzazUtIXcvUDRNaypGPW4zQQ=="
        }
      })
      .then(res => {
        resolve(res.data);
      });
  });
}

printReport(url1);
