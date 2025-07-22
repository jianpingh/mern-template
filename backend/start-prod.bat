@echo off
echo Starting MERN Backend Server (Production)...
cd /d "E:\study\node\mern-template\backend"
set NODE_ENV=production
node src\app.js
