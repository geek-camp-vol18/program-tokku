import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

// ミドルウェア
app.use(cors());
app.use(express.json());

// ヘルスチェック
app.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "プログラム特区 API is running" });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
