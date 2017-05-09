const axios = require('axios');
const fs = require('fs');

const BASE = 'http://austintindle.harvestapp.com/';
var projectID = '13871903';
var start = '20170301';
var end = '20170508';
var url = '/projects/' + projectID + '/entries?from=' + start + '&to=' + end;

// refactor this
axios.get(url, {
	baseURL: BASE,
	headers: {
		"Content-Type": 'application/json',
		"Accept": 'application/json',
		"Authorization": 'Basic dGluZGxlYWpAZ21haWwuY29tOkZzazUtIXcvUDRNaypGPW4zQQ=='
	} 
}).then((res) => {
	res.data.forEach((entry) => {
		getTaskByID(entry.day_entry.task_id).then((res) => {
			console.log(`[${res.task.name}] - ${entry.day_entry.notes}`);
		})
	});
});

function getTaskByID(id) {
	return new Promise((resolve, reject) => {
		axios.get('tasks/' + id, {
			baseURL: BASE,
			headers: {
				"Content-Type": 'application/json',
				"Accept": 'application/json',
				"Authorization": 'Basic dGluZGxlYWpAZ21haWwuY29tOkZzazUtIXcvUDRNaypGPW4zQQ=='
			}
		}).then((res) => {
			resolve(res.data);
		});
	});
}

function getTaskByName(name) {
	// Get all tasks
	getAllTasks().then((res) => {
		res.forEach((entry) => {
			// if task name is the parameter passed
			if (entry.task.name === name) {
				var id = entry.task.id;
				getTaskByID(id).then((res) => {
					console.log(res);
				});
			}
		});
	});	
}

function getAllTasks() {
	return new Promise((resolve, reject) => {
		axios.get('tasks/', {
			baseURL: BASE,
			headers: {
				"Content-Type": 'application/json',
				"Accept": 'application/json',
				"Authorization": 'Basic dGluZGxlYWpAZ21haWwuY29tOkZzazUtIXcvUDRNaypGPW4zQQ=='
			}
		}).then((res) => {
			resolve(res.data);
		});
	});
}