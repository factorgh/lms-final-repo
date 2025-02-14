const express = require("express");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.post("/generate-certificate/", async (req, res) => {
  const { userDetails, course } = req.body;
  console.log(userDetails, course);

  const canvas = createCanvas(900, 650); // Increased size for better layout
  const ctx = canvas.getContext("2d");

  // **Set Background Color**
  ctx.fillStyle = "#f8f8f8"; // Light gray background
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // **Add a Decorative Border**
  ctx.strokeStyle = "#000"; // Black border
  ctx.lineWidth = 8;
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

  // **Optional: Add a Logo**
  try {
    const logo = await loadImage(path.join(__dirname, "/assets/logo.jpeg"));
    ctx.drawImage(logo, canvas.width / 2 - 50, 40, 100, 100); // Centered at top
  } catch (error) {
    console.log("Logo not found, skipping...");
  }

  // **Add Certificate Title**
  ctx.font = "bold 42px Arial";
  ctx.fillStyle = "#000";
  ctx.textAlign = "center";
  ctx.fillText("Certificate of Completion", canvas.width / 2, 180);

  // **Add Subtext**
  ctx.font = "20px Arial";
  ctx.fillStyle = "#555";
  ctx.fillText(
    "This certificate is proudly presented to",
    canvas.width / 2,
    230
  );

  // **Add User's Name**
  ctx.font = "bold 36px Arial";
  ctx.fillStyle = "#222";
  ctx.fillText(userDetails, canvas.width / 2, 280);

  // **Add Course Details**
  ctx.font = "20px Arial";
  ctx.fillStyle = "#555";
  ctx.fillText(`For successfully completing the course`, canvas.width / 2, 330);

  ctx.font = "italic 24px Arial";
  ctx.fillStyle = "#007bff"; // Blue color
  ctx.fillText(`"${course}"`, canvas.width / 2, 370);

  // **Add Date & Signature**
  const issueDate = new Date().toLocaleDateString();
  ctx.font = "18px Arial";
  ctx.fillStyle = "#444";
  ctx.fillText(`Issued on: ${issueDate}`, 150, 500);

  ctx.fillText("________________________", canvas.width - 250, 480);
  ctx.fillText("Authorized Signature", canvas.width - 250, 510);

  // **Save and Send Certificate**
  const buffer = canvas.toBuffer("image/png");
  const certificatesDir = path.join(__dirname, "certificates");

  // Ensure directory exists
  if (!fs.existsSync(certificatesDir)) {
    fs.mkdirSync(certificatesDir, { recursive: true });
  }

  const filePath = path.join(certificatesDir, `${userDetails}.png`);
  fs.writeFileSync(filePath, buffer);
  res.sendFile(filePath);
});

module.exports = router;
