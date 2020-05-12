const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const failIfRepositoryIdDontExist = (request, response, next) => {
  const { id } = request.params
  const repositoryIndex = repositories.findIndex(repo => repo.id === id)

  if(repositoryIndex < 0){
    return response.status(400).json({error: 'Repository not found'})
  }

  request.repositoryIndex = repositoryIndex

  return next()
}

app.use("/repositories/:id", failIfRepositoryIdDontExist)

app.get("/repositories", (_, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title , url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0 
  }

  repositories.push(repository)

  response.status(201).json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { title , url, techs } = request.body

  const repository = {
    ...repositories[request.repositoryIndex],
    title,
    url,
    techs
  }

  repositories[request.repositoryIndex] = repository

  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  repositories.splice(request.repositoryIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const repository = repositories[request.repositoryIndex]
  repository.likes++

  return response.status(201).json(repository)
});

module.exports = app;
