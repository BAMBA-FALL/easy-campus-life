@echo off
echo Initialisation de la base de donnees...
curl -X POST https://easy-campus-life.onrender.com/initialize-db -H "Content-Type: application/json"
echo.
echo.
echo Base de donnees initialisee!
echo.
echo Comptes crees:
echo - Etudiant: etudiant@test.com / student123
echo - Admin: admin@campus.fr / admin2024
pause
