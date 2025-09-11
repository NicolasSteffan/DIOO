@echo off
setlocal EnableDelayedExpansion

:: =============================================================================
:: DIOO - Script de Connexion Client (Windows)
:: Description: Connexion sécurisée via SSH Tunnel
:: Usage: Remplacer les variables ci-dessous avec vos identifiants
:: =============================================================================

:: CONFIGURATION CLIENT - À PERSONNALISER
set SERVER_HOST=dioo-server.entreprise.com
set USERNAME=votre-nom
set SSH_KEY=C:\DIOO-Access\dioo-access.key
set LOCAL_PORT=3020

echo.
echo ===============================================
echo         DIOO - Connexion Client Sécurisée
echo ===============================================
echo.

:: Vérifier la présence de la clé SSH
if not exist "%SSH_KEY%" (
    echo [ERROR] Clé SSH non trouvée : %SSH_KEY%
    echo [INFO] Contactez votre administrateur pour obtenir la clé
    pause
    exit /b 1
)

:: Vérifier si le port local est libre
netstat -an 2>nul | findstr :%LOCAL_PORT% >nul
if %errorlevel% equ 0 (
    echo [WARNING] Port %LOCAL_PORT% déjà utilisé
    echo [INFO] Fermeture des connexions existantes...
    
    for /f "tokens=5" %%i in ('netstat -ano 2^>nul ^| findstr :%LOCAL_PORT%') do (
        if "%%i" neq "" if "%%i" neq "0" (
            taskkill /F /PID %%i >nul 2>nul
        )
    )
    timeout /t 2 /nobreak >nul
)

echo [INFO] Connexion au serveur DIOO...
echo [INFO] Serveur: %SERVER_HOST%
echo [INFO] Utilisateur: %USERNAME%
echo [INFO] Port local: %LOCAL_PORT%
echo.

:: Créer le tunnel SSH
echo [INFO] Établissement du tunnel sécurisé...
start "DIOO SSH Tunnel" /MIN ssh -i "%SSH_KEY%" -L %LOCAL_PORT%:localhost:3020 -N %USERNAME%@%SERVER_HOST%

:: Attendre que le tunnel soit établi
echo [INFO] Vérification de la connexion...
set /a "tentatives=0"

:check_tunnel
set /a "tentatives+=1"
timeout /t 2 /nobreak >nul

netstat -an 2>nul | findstr :%LOCAL_PORT% >nul
if %errorlevel% equ 0 (
    echo [OK] Tunnel SSH établi avec succès !
    goto :open_browser
)

if %tentatives% lss 10 (
    echo [INFO] Tentative %tentatives%/10...
    goto :check_tunnel
)

echo [ERROR] Impossible d'établir le tunnel SSH
echo [INFO] Vérifiez votre connexion internet et contactez l'administrateur
pause
exit /b 1

:open_browser
echo.
echo ===============================================
echo           DIOO - Accès Sécurisé Prêt
echo ===============================================
echo.

set URL=http://localhost:%LOCAL_PORT%
echo [OK] Application DIOO accessible sur: %URL%
echo [INFO] Ouverture automatique du navigateur...

:: Ouvrir le navigateur
start "" "%URL%"

echo.
echo ===============================================
echo              INFORMATIONS CLIENT
echo ===============================================
echo.
echo URL d'accès: %URL%
echo Serveur distant: %SERVER_HOST%
echo Utilisateur: %USERNAME%
echo Connexion établie: %date% %time%
echo.
echo IMPORTANT:
echo - Gardez cette fenêtre ouverte pendant votre session
echo - Fermez cette fenêtre pour déconnecter
echo - En cas de problème, contactez l'administrateur
echo.
echo ===============================================
echo         Session DIOO Active - Ne pas fermer
echo ===============================================
echo.

:: Maintenir la connexion active
echo [INFO] Session active - Appuyez sur Ctrl+C pour déconnecter
:keep_alive
timeout /t 30 /nobreak >nul
netstat -an 2>nul | findstr :%LOCAL_PORT% >nul
if %errorlevel% neq 0 (
    echo [WARNING] Connexion perdue - Tentative de reconnexion...
    goto :check_tunnel
)
goto :keep_alive

endlocal