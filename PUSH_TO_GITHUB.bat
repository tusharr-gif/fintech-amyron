@echo off
if exist .git\index.lock del .git\index.lock
if not exist .git (
    git init
    git remote add origin https://github.com/tusharr-gif/fintech-amyron.git
)
git rm -r --cached .
git add .
git commit -m "CreditPulse: Auto Update - All Files"
git push -u origin master || git push -u origin main
echo Push Complete! 🎉
pause
