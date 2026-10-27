const express = require("express");
const { analyzeCode } =
  require("../analyzer/codeAnalyzer");

const router = express.Router();

router.post("/analyze", (req, res) => {
  try {
    const { code } = req.body;

    const result = analyzeCode(code);

    res.json({
      success: true,
      analysis: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;