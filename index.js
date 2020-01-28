const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

let requisicoes = 0;

// Some data to start
projects.push({
    id: 1,
    title: "New project 01",
    tasks: ["task 1", "task 2", "task 3"]
}, {
    id: 2,
    title: "New Project 02",
    tasks: ["task 1"]
});

// Middleware
function checkProjectId(req, res, next) {

    const { id } = req.params;

    const project = projects.find(proj => proj.id == id);

    req.params.project = project;

    if (!project) {
        return res.status(400).json({ error: "No project found" });
    }

    return next();
}

// Middleware aditional
function checkProjectTaskId(req, res, next) {

    const { project, taskIndex } = req.params;

    const taskId = project.tasks[taskIndex];

    if(!taskId) {
        return res.status(400).json({ error: "No task found in the project" });
    }

    return next();
}


server.use((req, res, next) => {

    console.log(++requisicoes);
    return next();
});

// Add project
server.post('/projects', (req, res) => {
    const {id, title} = req.body;

    projects.push({
        id,
        title,
        tasks: []
    })


    return res.json(projects);

})

// Read projects
server.get('/projects', (req, res) => { 

    return res.json(projects);
})

// Change Project
server.put('/projects/:id', checkProjectId,  (req, res) => {
    const {id} = req.params;
    const {title} = req.body;

    // Find project by id
    const project = projects.find(proj => proj.id == id);

    project.title = title;

    // Response
    return res.send(project);
})

// Delete project
server.delete('/projects/:id', checkProjectId, (req, res) => {
    const {id} = req.params;

    // Find index project by id
    const projDelete = projects.findIndex(proj => proj.id == id);

    projects.splice(projDelete, 1);

    return res.send(projects);

})

// Add Task to a project
server.post('/projects/:id/tasks', checkProjectId, (req, res) => {
    const {id} = req.params;
    const {title} = req.body;

    const projTaskAdd = projects.find(proj => proj.id == id);

    projTaskAdd.tasks.push(title);

    return res.json(projTaskAdd);
})

// Remove task from project
server.post('/projects/:id/tasks/:taskIndex',checkProjectId, checkProjectTaskId, (req, res) => {
    const {id, taskIndex} = req.params;

    const projTaskRemove = projects.find(proj => proj.id == id);

    // remove task
    projTaskRemove.tasks.splice(taskIndex, 1);

    return res.json(projTaskRemove);
})

server.listen(3333);

