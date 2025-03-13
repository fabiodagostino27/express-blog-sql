const express = require("express");
const app = express();
const port = 3000;
const routerPosts = require("./routers/posts")
const errorsHandler = require("./middlewares/errorsHandler");
const notFound = require("./middlewares/notFound");
const cors = require("cors");

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.static("public"));
app.use(express.json());

app.use("/posts/api", routerPosts);

app.use(notFound);
app.use(errorsHandler);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
