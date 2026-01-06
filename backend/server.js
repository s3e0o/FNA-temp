import express from "express";
import cors from "cors";

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.json({
    blogPost: [
      {
        title: "The Journey of a Thousand Miles",
        content:
          "An exploration of the importance of taking the first step in any journey.",
      },
    ],
  });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
