const posts = require("../data/postsData");
const connection = require("../data/db");

const index = (req, res) => {
    //let filteredPosts = posts;

    //if(req.query.tag) {
    //    filteredPosts = posts.filter(post => post.tags.includes(req.query.tag))
    //};

    //res.json(filteredPosts);

    // SQL
    const sql = "SELECT * FROM `posts`";

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({
            error: "Database error" 
        });

        res.json(results);
    })
};

const show = (req, res) => {
    //const id = parseInt(req.params.id);
    //const post = posts.find(post => post.id === id);

    //if (!post) {
    //    res.status(404);

    //    return res.json ({
    //        error: "Not Found",
    //        message: "Post non trovato"
    //    })
    //};

    //res.json(post);

    // SQL
    const postsSql = "SELECT * FROM `posts` WHERE `id` = ?";
    const tagsSql = `
        SELECT tags.* 
        FROM posts 
        JOIN post_tag ON posts.id = post_tag.post_id 
        JOIN tags ON post_tag.tag_id = tags.id
        WHERE post_tag.post_id = ?
        `

    const id = req.params.id;

    connection.query(postsSql, [id], (err, postsResults) => {
        if (err) return res.status(500).json({
            error: "Database error"
        });

        if (postsResults.length === 0) {
            return res.status(404).json({
                error: "Post non trovato"
            });
        };

        const post = postsResults[0];

        connection.query(tagsSql, [id], (err, tagsResults) => {
            if (err) return res.status(500).json({
                error: "Database error"
            });

            post.tags = tagsResults;
            res.json(post);
        })


    });

}

const store = (req, res) => {
    const newId = posts[posts.length - 1].id + 1;;
    const newPost = {
        id: newId,
        title: req.body.title,
        content: req.body.content,
        image: req.body.image,
        tags: req.body.tags
    };

    posts.push(newPost);
    console.log(posts);
    res.status(201);
    res.json(newPost);
};

const update = (req, res) => {
    const id = parseInt(req.params.id);
    const post = posts.find(post => post.id === id);

    if (!post) {
        res.status(404);

        return res.json({
            error: "Not Found",
            message: "Post non trovato"
        })
    };

    post.title = req.body.title;
    post.content = req.body.content;
    post.image = req.body.image;
    post.tags = req.body.tags;

    res.json(post);
};

const modify = (req, res) => res.send(`Modifica parziale del post: ${req.params.id}`);

const destroy = (req, res) => {
    //const id = parseInt(req.params.id);
    //const post = posts.find(post => post.id === id);

    //if (!post) {
    //    res.status(404);

    //    return res.json ({
    //        error: "Not Found",
    //        message: "Post non trovato"
    //    })
    //};

    //posts.splice(posts.indexOf(post), 1);
    //res.sendStatus(204);
    //console.log(posts);

    // SQL
    const sqlCheck = "SELECT * FROM `posts` WHERE `id` = ?";
    const sqlDel = "DELETE FROM `posts` WHERE `id` = ?";
    const id = req.params.id;

    connection.query(sqlCheck, [id], (err, results) => {
        if (err) return res.status(500).json({
            error: "Database error"
        });

        if (results.length === 0) {
            return res.status(404).json({
                error: "Post non trovato"
            })
        }

        connection.query(sqlDel, [id], (err) => {
            if (err) return res.status(500).json({
                error: "Database error"
            });

            return res.sendStatus(204)
        });
    });

}


module.exports = { index, show, store, update, modify, destroy };