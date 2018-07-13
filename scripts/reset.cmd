@echo off
cd "%~dp0\.."

echo =================================================
echo ==== Reset node_modules
echo =================================================
echo.

if exist "node_modules" (
echo === Delete node_modules
rd /q /s node_modules
echo === finished
echo.
)

if exist "app\components" (
echo "=== Delete components"
rd /q /s app\components
echo === finished
echo.
)

echo "=== Clean cache npm"
call npm cache clean
echo "=== finished"
echo.
echo "=== Install node_modules"
call npm install
echo "=== finished"
echo.
