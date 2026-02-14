@echo off
echo Starting Admin Migration...

cd ..
if not exist "ottox-admin" mkdir "ottox-admin"

echo Copying files to ottox-admin (excluding large folders)...
robocopy "001" "ottox-admin" /E /XD node_modules .next .git .vscode /XF .env.local /XO /FFT /R:3 /W:10

echo initializing git in ottox-admin...
cd ottox-admin
git init
git add .
git commit -m "feat: Initial commit of Admin Panel"
git branch -M main
git remote add origin https://github.com/SonuPaikrao/ottox-admin.git

echo Pushing to remote...
git push -u origin main

echo.
echo Migration script completed!
echo Please check if the push was successful.
pause
