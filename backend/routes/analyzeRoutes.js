const express = require("express");
const { analyzeCode } = require("../analyzer/codeAnalyzer");
const Analysis = require("../models/Analysis");

const router = express.Router();

router.post("/analyze", async (req, res) => {
  try {
    const { code } = req.body;

    if (typeof code !== "string" || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: "Source code is required"
      });
    }

    if (Buffer.byteLength(code, "utf8") > 100000) {
      return res.status(413).json({
        success: false,
        message: "Source code exceeds the 100 KB limit"
      });
    }

    const result = analyzeCode(code);

    const savedAnalysis = await Analysis.create({
      language: result.language,
      sourceCode: code,
      totalLines: result.totalLines,
      functions: result.functions,
      classes: result.classes,
      imports: result.imports
    });

    res.status(201).json({
      success: true,
      analysis: result,
      analysisId: savedAnalysis._id
    });

  } catch (error) {
    if (error instanceof SyntaxError) {
      return res.status(400).json({
        success: false,
        message: "Invalid JavaScript syntax"
      });
    }

    console.error("Analysis error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to analyze source code"
    });
  }
});

router.get("/analyses", async (req, res) => {
  try {
    const analyses = await Analysis.find()
      .select("-sourceCode")
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      analyses
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to retrieve analyses"
    });
  }
});

module.exports = router;