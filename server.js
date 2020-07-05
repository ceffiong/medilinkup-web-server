const express = require('express')
const app = express()
const path = require("path")
const PORT = 3001;

app.use(express.static(path.join(__dirname, "frontend", "build")))
app.listen(PORT, () => {console.log(`Server is listening on port ${PORT}`)})