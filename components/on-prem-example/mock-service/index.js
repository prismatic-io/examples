const app = require("express")();

app.get("/", (req, res) => {
  // If the hostname is not api.example.com, return a 400
  if (req.headers.host !== "api.example.com") {
    res
      .status(400)
      .send("Incorrect hostname was used. Expecting api.example.com");
    return;
  }

  // Return some mock data
  res.send({
    userId: 1,
    id: 1,
    title: "delectus aut autem",
    completed: false,
  });
});

app.listen(3000, () => {
  console.log(`Example app listening on port 3000`);
});
